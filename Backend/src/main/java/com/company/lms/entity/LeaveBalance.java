package com.company.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balance", uniqueConstraints = @UniqueConstraint(columnNames = { "employee_id", "leave_type" }))
public class LeaveBalance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long employeeId;

	private String leaveType;

	private int totalLeave;

	private int usedLeave;

	private int remainingLeave;

	public LeaveBalance() {
	}

	public Long getId() {
		return id;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}

	public int getTotalLeave() {
		return totalLeave;
	}

	public void setTotalLeave(int totalLeave) {
		this.totalLeave = totalLeave;
	}

	public int getUsedLeave() {
		return usedLeave;
	}

	public void setUsedLeave(int usedLeave) {
		this.usedLeave = usedLeave;
	}

	public int getRemainingLeave() {
		return remainingLeave;
	}

	public void setRemainingLeave(int remainingLeave) {
		this.remainingLeave = remainingLeave;
	}
}