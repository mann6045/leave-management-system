package com.company.lms.service.impl;

import com.company.lms.entity.LeaveBalance;
import com.company.lms.repository.LeaveBalanceRepository;
import com.company.lms.service.LeaveBalanceService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeaveBalanceServiceImpl implements LeaveBalanceService {

	@Autowired
	private LeaveBalanceRepository repository;

	@Override
	public LeaveBalance getBalance(Long employeeId, String leaveType) {

		return repository.findByEmployeeIdAndLeaveType(employeeId, leaveType)
				.orElseThrow(() -> new RuntimeException("Leave balance not found"));
	}

	@Override
	public void deductLeave(Long employeeId, String leaveType, int days) {

		// normalize leave type
		leaveType = leaveType.toUpperCase();

		LeaveBalance balance = repository.findByEmployeeIdAndLeaveType(employeeId, leaveType)
				.orElseThrow(() -> new RuntimeException("Leave balance not found"));

		if (balance.getRemainingLeave() < days) {
			throw new RuntimeException("Not enough leave balance");
		}

		balance.setUsedLeave(balance.getUsedLeave() + days);
		balance.setRemainingLeave(balance.getRemainingLeave() - days);

		repository.save(balance);
	}

	@Override
	public List<LeaveBalance> getEmployeeBalances(Long employeeId) {

		return repository.findByEmployeeId(employeeId);

	}
}