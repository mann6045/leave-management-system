package com.company.lms.service;

import com.company.lms.dto.LoginRequest;
import com.company.lms.dto.RegisterRequest;
import com.company.lms.dto.AuthResponse;
import com.company.lms.entity.User;

public interface UserService {

    User register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}