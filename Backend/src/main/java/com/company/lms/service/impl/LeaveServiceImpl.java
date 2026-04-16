package com.company.lms.service.impl;

import com.company.lms.entity.LeaveBalance;
import com.company.lms.entity.LeaveRequest;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveRepository;
import com.company.lms.repository.UserRepository;
import com.company.lms.service.EmailService;
import com.company.lms.service.LeaveBalanceService;
import com.company.lms.service.LeaveService;
import com.company.lms.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepository;

	@Autowired
	private LeaveBalanceService leaveBalanceService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private NotificationService notificationService;

	// =============================
	// APPLY LEAVE
	// =============================
	@Override
	public LeaveRequest applyLeave(LeaveRequest leaveRequest) {

		LocalDate today = LocalDate.now();

		// 1️⃣ PREVENT PAST DATE
		if (leaveRequest.getStartDate().isBefore(today)) {
			throw new RuntimeException("Cannot apply leave for past dates");
		}

		// 2️⃣ VALIDATE DATE RANGE
		if (leaveRequest.getEndDate().isBefore(leaveRequest.getStartDate())) {
			throw new RuntimeException("End date cannot be before start date");
		}

		// 3️⃣ CALCULATE DAYS
		int days = (int) ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;

		if (days <= 0) {
			throw new RuntimeException("Invalid leave duration");
		}

		// 4️⃣ CHECK BALANCE
		LeaveBalance balance = leaveBalanceService.getBalance(leaveRequest.getEmployeeId(),
				leaveRequest.getLeaveType());

		if (balance.getRemainingLeave() < days) {
			throw new RuntimeException("Not enough leave balance");
		}

		// 5️⃣ CHECK OVERLAP (exclude REJECTED)
		List<LeaveRequest> existingLeaves = leaveRepository.findByEmployeeId(leaveRequest.getEmployeeId());

		for (LeaveRequest existing : existingLeaves) {

			if (!"REJECTED".equals(existing.getStatus())) {

				boolean overlap = !(leaveRequest.getEndDate().isBefore(existing.getStartDate())
						|| leaveRequest.getStartDate().isAfter(existing.getEndDate()));

				if (overlap) {
					throw new RuntimeException("Leave dates overlap with existing leave");
				}
			}
		}

		// 6️⃣ SAVE DAYS
		leaveRequest.setDays(days);

		// 7️⃣ STATUS
		leaveRequest.setStatus("PENDING");
		leaveRequest.setAppliedDate(LocalDateTime.now());

		LeaveRequest savedLeave = leaveRepository.save(leaveRequest);

		// =============================
		// 🔔 NOTIFICATIONS
		// =============================

		// 👉 Get employee name (for better message)
		User employee = userRepository.findById(savedLeave.getEmployeeId()).orElse(null);

		String empName = (employee != null) ? employee.getName() : "Employee";

		// 🔔 Notify Employee
		notificationService.createNotification(savedLeave.getEmployeeId(), "Your leave request has been submitted ⏳");

		// 🔔 Notify ALL Managers
		List<User> managers = userRepository.findByRole("MANAGER");

		for (User manager : managers) {
			notificationService.createNotification(manager.getId(), "New leave request from " + empName);
		}

		// 🔔 Notify ALL Admins
		List<User> admins = userRepository.findByRole("ADMIN");

		for (User admin : admins) {
			notificationService.createNotification(admin.getId(), "New leave request from " + empName);
		}

		return savedLeave;
	}

	// =============================
	// EMPLOYEE LEAVES
	// =============================
	@Override
	public List<LeaveRequest> getEmployeeLeaves(Long employeeId) {
		return leaveRepository.findByEmployeeId(employeeId);
	}

	// =============================
	// PENDING LEAVES
	// =============================
	@Override
	public List<LeaveRequest> getPendingLeaves() {
		return leaveRepository.findByStatus("PENDING");
	}

	// =============================
	// APPROVE LEAVE
	// =============================
	@Override
	public LeaveRequest approveLeave(Long id, Long managerId) {

		LeaveRequest leave = leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));

		if (!"PENDING".equals(leave.getStatus())) {
			throw new RuntimeException("Leave already processed");
		}

		int days = (int) ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;

		leave.setDays(days);

		// 💰 Deduct leave balance
		try {
			leaveBalanceService.deductLeave(leave.getEmployeeId(), leave.getLeaveType(), days);
		} catch (Exception e) {
			System.out.println("Leave balance issue");
		}

		leave.setStatus("APPROVED");
		leave.setApprovedBy(managerId);

		LeaveRequest updatedLeave = leaveRepository.save(leave);

		// 🔔 Notify Employee
		notificationService.createNotification(leave.getEmployeeId(), "Your leave has been APPROVED ✅");

		// 📧 Email
		userRepository.findById(leave.getEmployeeId()).ifPresent(user -> {
			try {
				emailService.sendLeaveApprovedEmail(user.getEmail(), user.getName());
			} catch (Exception e) {
				System.out.println("Email failed");
			}
		});

		return updatedLeave;
	}

	// =============================
	// REJECT LEAVE
	// =============================
	@Override
	public LeaveRequest rejectLeave(Long leaveId, Long managerId) {

		LeaveRequest leave = leaveRepository.findById(leaveId)
				.orElseThrow(() -> new RuntimeException("Leave not found"));

		if (!"PENDING".equals(leave.getStatus())) {
			throw new RuntimeException("Leave already processed");
		}

		leave.setStatus("REJECTED");
		leave.setApprovedBy(managerId);

		LeaveRequest updatedLeave = leaveRepository.save(leave);

		// 🔔 Notify Employee
		notificationService.createNotification(leave.getEmployeeId(), "Your leave has been REJECTED ❌");

		// 📧 Email
		userRepository.findById(leave.getEmployeeId()).ifPresent(user -> {
			try {
				emailService.sendLeaveRejectedEmail(user.getEmail(), user.getName());
			} catch (Exception e) {
				System.out.println("Email failed");
			}
		});

		return updatedLeave;
	}

	// =============================
	@Override
	public List<LeaveRequest> getAllLeaves() {
		return leaveRepository.findAll();
	}
}