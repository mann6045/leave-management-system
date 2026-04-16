package com.company.lms.controller;

import com.company.lms.dto.LeaveResponse;
import com.company.lms.entity.LeaveRequest;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveRepository;
import com.company.lms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class AdminController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private LeaveRepository leaveRepository;

	// =============================
	// GET ALL USERS
	// =============================
	@GetMapping("/users")
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	// =============================
	// CREATE USER
	// =============================
	@PostMapping("/users")
	public User createUser(@RequestBody User user, Authentication authentication) {

		User currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();

		// Manager can only create EMPLOYEE
		if ("MANAGER".equals(currentUser.getRole())) {
			user.setRole("EMPLOYEE");
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		// ✅ NEW FIELDS (safe set)
		user.setContactNumber(user.getContactNumber());
		user.setAddress(user.getAddress());

		return userRepository.save(user);
	}

	// =============================
	// UPDATE USER
	// =============================
	@PutMapping("/users/{id}")
	public User updateUser(@PathVariable Long id, @RequestBody User updatedUser, Authentication authentication) {

		User existingUser = userRepository.findById(id).orElseThrow();

		User currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();

		// Manager restriction
		if ("MANAGER".equals(currentUser.getRole())) {
			if (!"EMPLOYEE".equals(existingUser.getRole())) {
				throw new RuntimeException("Managers can only update EMPLOYEES");
			}
		}

		// Basic fields
		existingUser.setName(updatedUser.getName());
		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setDepartment(updatedUser.getDepartment());

		// ✅ NEW FIELDS
		existingUser.setContactNumber(updatedUser.getContactNumber());
		existingUser.setAddress(updatedUser.getAddress());

		// Only ADMIN can change role
		if ("ADMIN".equals(currentUser.getRole())) {
			existingUser.setRole(updatedUser.getRole());
		}

		return userRepository.save(existingUser);
	}

	// =============================
	// DELETE USER
	// =============================
	@DeleteMapping("/users/{id}")
	public void deleteUser(@PathVariable Long id, Authentication authentication) {

		User user = userRepository.findById(id).orElseThrow();

		User currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();

		// Manager restriction
		if ("MANAGER".equals(currentUser.getRole())) {
			if (!"EMPLOYEE".equals(user.getRole())) {
				throw new RuntimeException("Managers can only delete EMPLOYEES");
			}
		}

		userRepository.deleteById(id);
	}

	// =============================
	// GET ALL LEAVES
	// =============================
	@GetMapping("/leaves")
	public List<LeaveResponse> getAllLeaves() {

		List<LeaveRequest> leaves = leaveRepository.findAll();

		return leaves.stream().map(leave -> {

			User user = null;

			try {
				if (leave.getEmployeeId() != null) {
					user = userRepository.findById(leave.getEmployeeId()).orElse(null);
				}
			} catch (Exception e) {
				System.out.println("USER FETCH ERROR");
			}

			String name = (user != null) ? user.getName() : "Unknown";
			String dept = (user != null) ? user.getDepartment() : "-";

			return new LeaveResponse(leave.getId(), leave.getEmployeeId(), name, dept, leave.getLeaveType(),
					leave.getStartDate(), leave.getEndDate(), leave.getDays(), leave.getReason(), leave.getStatus());

		}).toList();
	}

	// =============================
	// FILTER LEAVES
	// =============================
	@GetMapping("/leaves/filter")
	public List<LeaveResponse> filterLeaves(@RequestParam(required = false) String status,
			@RequestParam(required = false) String type) {

		List<LeaveRequest> leaves;

		if (status != null && type != null) {
			leaves = leaveRepository.findByStatusAndLeaveType(status, type);
		} else if (status != null) {
			leaves = leaveRepository.findByStatus(status);
		} else {
			leaves = leaveRepository.findAll();
		}

		return leaves.stream().map(leave -> {

			User user = userRepository.findById(leave.getEmployeeId()).orElse(null);

			String name = user != null ? user.getName() : "Employee";
			String dept = user != null ? user.getDepartment() : "-";

			return new LeaveResponse(leave.getId(), leave.getEmployeeId(), name, dept, leave.getLeaveType(),
					leave.getStartDate(), leave.getEndDate(), leave.getDays(), leave.getReason(), leave.getStatus());

		}).toList();
	}
}