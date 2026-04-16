package com.company.lms.dto;

import java.time.LocalDate;

public class LeaveResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String department;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private int days;
    private String reason;
    private String status;

    public LeaveResponse(
            Long id,
            Long employeeId,
            String employeeName,
            String department,
            String leaveType,
            LocalDate startDate,
            LocalDate endDate,
            int days,
            String reason,
            String status) {

        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.days = days;
        this.reason = reason;
        this.status = status;
	}

	public Long getId() {
		return id;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public String getDepartment() {
		return department;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public int getDays() {
		return days;
	}

	public String getReason() {
		return reason;
	}

	public String getStatus() {
		return status;
	}
}