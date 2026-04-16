package com.company.lms.dto;

import java.util.List;

public class BulkBalanceRequest {

	private String mode;
	private List<Long> employeeIds;
	private String leaveType;
	private String action;
	private int value;

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public List<Long> getEmployeeIds() {
		return employeeIds;
	}

	public void setEmployeeIds(List<Long> employeeIds) {
		this.employeeIds = employeeIds;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

}