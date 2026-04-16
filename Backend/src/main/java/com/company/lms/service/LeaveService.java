package com.company.lms.service;

import com.company.lms.entity.LeaveRequest;
import java.util.List;

public interface LeaveService {

    LeaveRequest applyLeave(LeaveRequest leaveRequest);

    List<LeaveRequest> getEmployeeLeaves(Long employeeId);

    List<LeaveRequest> getPendingLeaves();

    LeaveRequest approveLeave(Long leaveId, Long managerId);

    LeaveRequest rejectLeave(Long leaveId, Long managerId);
    
    List<LeaveRequest> getAllLeaves();
}