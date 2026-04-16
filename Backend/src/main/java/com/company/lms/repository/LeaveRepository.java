package com.company.lms.repository;

import com.company.lms.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

	List<LeaveRequest> findByEmployeeId(Long employeeId);

	List<LeaveRequest> findByStatus(String status);

	List<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, String status);

	long countByEmployeeId(Long employeeId);

	long countByEmployeeIdAndStatus(Long employeeId, String status);

	List<LeaveRequest> findByStatusAndLeaveType(String status, String leaveType);
	
	List<LeaveRequest> findByEmployeeIdIn(List<Long> ids);
}