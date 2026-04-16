package com.company.lms.controller;

import com.company.lms.dto.LeaveResponse;
import com.company.lms.entity.LeaveRequest;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveRepository;
import com.company.lms.repository.UserRepository;
import com.company.lms.service.LeaveService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
public class ManagerController {

	@Autowired
	private LeaveService leaveService;

	@Autowired
	private LeaveRepository leaveRepository;

	@Autowired
	private UserRepository userRepository;

	// =========================
	// GET ALL LEAVES
	// =========================
	@GetMapping("/manager/all")
	public List<LeaveResponse> getManagerLeaves(Authentication auth) {

		User manager = userRepository.findByEmail(auth.getName()).orElseThrow();

		List<User> employees = userRepository.findByManagerId(manager.getId());

		List<Long> ids = employees.stream().map(User::getId).toList();

		List<LeaveRequest> leaves = leaveRepository.findByEmployeeIdIn(ids);

		return leaves.stream().map(l -> {

			User emp = userRepository.findById(l.getEmployeeId()).orElse(null);

			return new LeaveResponse(l.getId(), l.getEmployeeId(), emp != null ? emp.getName() : "Unknown",
					emp != null ? emp.getDepartment() : "-", l.getLeaveType(), l.getStartDate(), l.getEndDate(),
					l.getDays(), l.getReason(), l.getStatus());

		}).toList();
	}

	// =========================
	// APPROVE LEAVE
	// =========================
	@PutMapping("/approve/{id}")
	public LeaveRequest approveLeave(@PathVariable Long id, Authentication authentication) {

		User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();

		return leaveService.approveLeave(id, manager.getId());
	}

	// =========================
	// REJECT LEAVE
	// =========================
	@PutMapping("/reject/{id}")
	public LeaveRequest rejectLeave(@PathVariable Long id, Authentication authentication) {

		User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();

		return leaveService.rejectLeave(id, manager.getId());
	}

	@GetMapping("/team-stats")
	public Map<String, Long> getTeamStats(Authentication auth) {

		User manager = userRepository.findByEmail(auth.getName()).orElseThrow();

		List<User> employees = userRepository.findByManagerId(manager.getId());

		List<Long> empIds = employees.stream().map(User::getId).toList();

		List<LeaveRequest> leaves = leaveRepository.findByEmployeeIdIn(empIds);

		long totalEmployees = employees.size();
		long totalLeaves = leaves.size();
		long pending = leaves.stream().filter(l -> "PENDING".equals(l.getStatus())).count();

		Map<String, Long> map = new HashMap<>();
		map.put("employees", totalEmployees);
		map.put("leaves", totalLeaves);
		map.put("pending", pending);

		return map;
	}
}