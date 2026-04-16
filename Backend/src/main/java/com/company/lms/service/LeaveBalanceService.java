package com.company.lms.service;

import java.util.List;

import com.company.lms.entity.LeaveBalance;

public interface LeaveBalanceService {

    LeaveBalance getBalance(Long employeeId, String leaveType);

    void deductLeave(Long employeeId, String leaveType, int days);
    
    List<LeaveBalance> getEmployeeBalances(Long employeeId);
}