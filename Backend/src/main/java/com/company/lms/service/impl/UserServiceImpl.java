package com.company.lms.service.impl;

import com.company.lms.dto.LoginRequest;
import com.company.lms.dto.RegisterRequest;
import com.company.lms.dto.AuthResponse;
import com.company.lms.entity.LeaveBalance;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveBalanceRepository;
import com.company.lms.repository.UserRepository;
import com.company.lms.security.JwtUtil;
import com.company.lms.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private LeaveBalanceRepository leaveBalanceRepo;

	// =========================
	// REGISTER
	// =========================
	@Override
	public User register(RegisterRequest request) {

		User user = new User();

		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		// save department
		user.setDepartment(request.getDepartment());

		// default role
		user.setRole("EMPLOYEE");

		// 🔥 SAVE USER (OLD CODE KEPT)
		User savedUser = userRepository.save(user);

		// 🔥 NEW FEATURE (SAFE ADDITION - NO OLD CODE CHANGED)
		if (savedUser.getRole().equals("EMPLOYEE")) {
			createDefaultLeaveBalance(savedUser);
		}

		return savedUser;
	}

	// =========================
	// LOGIN
	// =========================
	@Override
	public AuthResponse login(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid password");
		}

		String token = jwtUtil.generateToken(user.getEmail());

		return new AuthResponse(token, user.getRole(), user.getId());
	}

	// =========================
	// AUTO CREATE LEAVE BALANCE
	// =========================
	private void createDefaultLeaveBalance(User user) {

		String[] types = { "CASUAL", "SICK", "PAID" };

		for (String type : types) {

			LeaveBalance balance = new LeaveBalance();

			balance.setEmployeeId(user.getId());
			balance.setLeaveType(type);

			if (type.equals("CASUAL"))
				balance.setTotalLeave(12);
			if (type.equals("SICK"))
				balance.setTotalLeave(10);
			if (type.equals("PAID"))
				balance.setTotalLeave(15);

			balance.setUsedLeave(0);
			balance.setRemainingLeave(balance.getTotalLeave());

			leaveBalanceRepo.save(balance);
		}
	}
}