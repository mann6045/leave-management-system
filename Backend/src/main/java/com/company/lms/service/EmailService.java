package com.company.lms.service;

public interface EmailService {

    void sendLeaveApprovedEmail(String to, String name);

    void sendLeaveRejectedEmail(String to, String name);

}