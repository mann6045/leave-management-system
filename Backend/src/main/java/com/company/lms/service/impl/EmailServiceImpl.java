package com.company.lms.service.impl;

import com.company.lms.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendLeaveApprovedEmail(String to, String name) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Leave Approved");

        message.setText(
                "Hello " + name +
                ",\n\nYour leave request has been APPROVED by your manager."
        );

        mailSender.send(message);
    }

    @Override
    public void sendLeaveRejectedEmail(String to, String name) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Leave Rejected");

        message.setText(
                "Hello " + name +
                ",\n\nYour leave request has been REJECTED by your manager."
        );

        mailSender.send(message);
    }
}