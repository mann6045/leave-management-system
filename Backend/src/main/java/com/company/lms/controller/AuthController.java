package com.company.lms.controller;

import com.company.lms.dto.AuthResponse;
import com.company.lms.dto.LoginRequest;
import com.company.lms.dto.RegisterRequest;
import com.company.lms.entity.LeaveRequest;
import com.company.lms.entity.User;
import com.company.lms.repository.LeaveRepository;
import com.company.lms.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private LeaveRepository leaveRepository;
	
    @Autowired
    private UserService userService;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        return userService.register(request);
    }

    // LOGIN
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        return userService.login(request);
    }
    @PutMapping("/approve/{id}")
    public LeaveRequest approveLeave(@PathVariable Long id) {

        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    @PutMapping("/reject/{id}")
    public LeaveRequest rejectLeave(@PathVariable Long id) {

        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }
}