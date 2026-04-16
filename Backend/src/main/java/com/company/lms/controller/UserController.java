package com.company.lms.controller;

import com.company.lms.entity.User;
import com.company.lms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public User getProfile(Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

    }
}