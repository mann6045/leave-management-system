package com.company.lms.controller;

import com.company.lms.dto.BulkBalanceRequest;
import com.company.lms.entity.LeaveBalance;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveBalanceRepository;
import com.company.lms.repository.UserRepository;
import com.company.lms.service.LeaveBalanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveBalanceController {

	@Autowired
	private LeaveBalanceService leaveBalanceService;

	@Autowired
	private LeaveBalanceRepository repo;

	@Autowired
	private UserRepository userRepo;

	// =========================
	// OLD API (UNCHANGED)
	// =========================
	@GetMapping("/balance/{employeeId}")
	public List<LeaveBalance> getBalance(@PathVariable Long employeeId) {
		return leaveBalanceService.getEmployeeBalances(employeeId);
	}

	// =========================
	// NEW BULK UPDATE (SAFE)
	// =========================
	@PostMapping("/balance/bulk-update")
	public String bulkUpdate(@RequestBody BulkBalanceRequest req) {

		List<User> employees;

		if ("ALL".equals(req.getMode())) {
			employees = userRepo.findByRole("EMPLOYEE");
		} else {
			employees = userRepo.findAllById(req.getEmployeeIds());
		}

		for (User emp : employees) {

			LeaveBalance balance = repo.findByEmployeeIdAndLeaveType(emp.getId(), req.getLeaveType()).orElseGet(() -> {
				LeaveBalance b = new LeaveBalance();
				b.setEmployeeId(emp.getId());
				b.setLeaveType(req.getLeaveType());
				b.setTotalLeave(0);
				b.setUsedLeave(0);
				return b;
			});

			if ("ADD".equals(req.getAction())) {
				balance.setTotalLeave(balance.getTotalLeave() + req.getValue());
			} else {
				balance.setTotalLeave(req.getValue());
			}

			balance.setRemainingLeave(balance.getTotalLeave() - balance.getUsedLeave());

			repo.save(balance);
		}

		return "Balance updated successfully";
	}

	// =========================
	// OLD UPDATE (UNCHANGED)
	// =========================
	@PutMapping("/balance/update")
	public LeaveBalance updateBalance(@RequestBody LeaveBalance balance) {

		LeaveBalance existing = repo.findByEmployeeIdAndLeaveType(balance.getEmployeeId(), balance.getLeaveType())
				.orElse(null);

		if (existing != null) {
			existing.setTotalLeave(balance.getTotalLeave());
			existing.setUsedLeave(balance.getUsedLeave());
			existing.setRemainingLeave(balance.getTotalLeave() - balance.getUsedLeave());
			return repo.save(existing);
		} else {
			balance.setRemainingLeave(balance.getTotalLeave() - balance.getUsedLeave());
			return repo.save(balance);
		}
	}

	@DeleteMapping("/balance/delete")
	public String deleteBalance(@RequestParam Long employeeId, @RequestParam String leaveType) {

		LeaveBalance balance = repo.findByEmployeeIdAndLeaveType(employeeId, leaveType).orElse(null);

		if (balance != null) {
			repo.delete(balance);
			return "✅ Leave balance deleted";
		}

		return "⚠️ No balance found";
	}

	@GetMapping("/balance/all")
	public List<Map<String, Object>> getAllBalances() {

		List<LeaveBalance> balances = repo.findAll();

		return balances.stream().map(b -> {

			User user = userRepo.findById(b.getEmployeeId()).orElse(null);

			Map<String, Object> map = new HashMap<>();
			map.put("employeeId", b.getEmployeeId());
			map.put("employeeName", user != null ? user.getName() : "Unknown");
			map.put("leaveType", b.getLeaveType());
			map.put("totalLeave", b.getTotalLeave());
			map.put("usedLeave", b.getUsedLeave());
			map.put("remainingLeave", b.getRemainingLeave());

			return map;

		}).toList();
	}

}