package com.company.lms.controller;

import com.company.lms.entity.LeaveRequest;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveRepository;
import com.company.lms.repository.UserRepository;
import com.company.lms.service.LeaveService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

	@Autowired
	private LeaveService leaveService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private LeaveRepository leaveRepository;

	// ================================
	// APPLY LEAVE
	// ================================
	@PostMapping("/apply")
	public LeaveRequest applyLeave(@RequestBody LeaveRequest leaveRequest, Authentication authentication) {

		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow();

		leaveRequest.setEmployeeId(user.getId());

		return leaveService.applyLeave(leaveRequest);
	}

	// ================================
	// GET CURRENT USER LEAVES
	// ================================
	@GetMapping("/my")
	public List<LeaveRequest> myLeaves(Authentication authentication) {

		String email = authentication.getName();

		if (email == null || email.equals("anonymousUser")) {
			throw new RuntimeException("User not authenticated. Please login again.");
		}

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return leaveService.getEmployeeLeaves(user.getId());
	}

//	@GetMapping("/balance/{employeeId}")
//	public List<LeaveBalance> getEmployeeBalance(@PathVariable Long employeeId) {
//		return leaveBalanceService.getEmployeeBalances(employeeId);
//	}

	// UPDATE LEAVE
	@PutMapping("/update/{id}")
	public LeaveRequest updateLeave(@PathVariable Long id, @RequestBody LeaveRequest request) {

		LeaveRequest leave = leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));

		if (!leave.getStatus().equals("PENDING")) {
			throw new RuntimeException("Only pending leave can be edited");
		}

		leave.setStartDate(request.getStartDate());
		leave.setEndDate(request.getEndDate());
		leave.setReason(request.getReason());

		return leaveRepository.save(leave);
	}

	// CANCEL LEAVE
	@DeleteMapping("/cancel/{id}")
	public void cancelLeave(@PathVariable Long id) {

		LeaveRequest leave = leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));

		if (!leave.getStatus().equals("PENDING")) {
			throw new RuntimeException("Only pending leave can be cancelled");
		}

		leaveRepository.delete(leave);
	}

	@GetMapping("/stats")
	public Map<String, Long> getLeaveStats(Authentication auth) {

		User user = userRepository.findByEmail(auth.getName()).orElseThrow();

		List<LeaveRequest> leaves = leaveRepository.findByEmployeeId(user.getId());

		long total = leaves.size();
		long pending = leaves.stream().filter(l -> "PENDING".equals(l.getStatus())).count();
		long approved = leaves.stream().filter(l -> "APPROVED".equals(l.getStatus())).count();
		long rejected = leaves.stream().filter(l -> "REJECTED".equals(l.getStatus())).count();

		Map<String, Long> map = new HashMap<>();
		map.put("total", total);
		map.put("pending", pending);
		map.put("approved", approved);
		map.put("rejected", rejected);

		return map;
	}

	@GetMapping("/monthly-stats")
	public Map<String, Long> getMonthlyStats(Authentication auth) {

		User user = userRepository.findByEmail(auth.getName()).orElseThrow();

		List<LeaveRequest> leaves = leaveRepository.findByEmployeeId(user.getId());

		Map<String, Long> monthly = new LinkedHashMap<>();

		// Initialize months
		String[] months = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
		for (String m : months) {
			monthly.put(m, 0L);
		}

		for (LeaveRequest leave : leaves) {
			if (leave.getStartDate() != null) {
				int monthIndex = leave.getStartDate().getMonthValue() - 1;
				String month = months[monthIndex];
				monthly.put(month, monthly.get(month) + 1);
			}
		}

		return monthly;
	}

	// ================================
	// MANAGER - GET TEAM LEAVES
	// ================================
	@GetMapping("/manager/all")
	public List<LeaveRequest> getManagerLeaves(Authentication auth) {

	    User manager = userRepository.findByEmail(auth.getName()).orElseThrow();

	    // get employees under this manager
	    List<User> employees = userRepository.findByManagerId(manager.getId());

	    List<Long> ids = employees.stream().map(User::getId).toList();

	    return leaveRepository.findByEmployeeIdIn(ids);
	}

	@PutMapping("/manager/approve/{id}")
	public LeaveRequest approveLeave(@PathVariable Long id, Authentication auth) {

	    LeaveRequest leave = leaveRepository.findById(id).orElseThrow();

	    leave.setStatus("APPROVED");

	    User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
	    leave.setApprovedBy(manager.getId());

	    return leaveRepository.save(leave);
	}

	@PutMapping("/manager/reject/{id}")
	public LeaveRequest rejectLeave(@PathVariable Long id, Authentication auth) {

	    LeaveRequest leave = leaveRepository.findById(id).orElseThrow();

	    leave.setStatus("REJECTED");

	    User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
	    leave.setApprovedBy(manager.getId());

	    return leaveRepository.save(leave);
	}
}