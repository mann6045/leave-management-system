import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.adm-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}

.adm-body {
  padding: 36px 40px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Page header */
.adm-page-header {
  margin-bottom: 32px;
  animation: fadeUp 0.4s ease both;
}
.adm-page-title {
  font-size: 26px;
  font-weight: 800;
  color: #1e1b4b;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}
.adm-page-sub {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

/* Stat cards */
.adm-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.adm-stat-card {
  background: #fff;
  border-radius: 18px;
  padding: 24px 26px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06), 0 12px 32px rgba(99,102,241,0.05);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation: fadeUp 0.4s ease both;
  transition: transform 0.2s, box-shadow 0.2s;
}
.adm-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(99,102,241,0.1), 0 20px 48px rgba(99,102,241,0.08);
}
.adm-stat-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.adm-stat-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
  margin-bottom: 4px;
}
.adm-stat-value {
  font-size: 34px;
  font-weight: 800;
  color: #1e1b4b;
  letter-spacing: -0.03em;
  line-height: 1;
}

/* Section */
.adm-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  margin-bottom: 24px;
  animation: fadeUp 0.45s ease both;
}
.adm-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.adm-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e1b4b;
  letter-spacing: -0.01em;
}
.adm-section-count {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  background: #ede9fe;
  padding: 3px 10px;
  border-radius: 100px;
}

/* Table */
.adm-table {
  width: 100%;
  border-collapse: collapse;
}
.adm-table thead tr {
  border-bottom: 1px solid #f3f4f6;
}
.adm-table thead th {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
  padding: 10px 14px;
  text-align: left;
}
.adm-table tbody tr {
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}
.adm-table tbody tr:last-child { border-bottom: none; }
.adm-table tbody tr:hover { background: #fafbff; }
.adm-table td {
  padding: 13px 14px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.adm-emp-name {
  font-weight: 700;
  color: #1e1b4b;
  font-size: 14px;
}
.adm-emp-id {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* Status badge */
.adm-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  letter-spacing: 0.04em;
}
.adm-badge.PENDING  { background: #fef3c7; color: #92400e; }
.adm-badge.APPROVED { background: #d1fae5; color: #065f46; }
.adm-badge.REJECTED { background: #fee2e2; color: #991b1b; }

.adm-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Role badge */
.adm-role {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.05em;
}
.adm-role.ADMIN    { background: #f5f3ff; color: #6d28d9; }
.adm-role.MANAGER  { background: #f0fdf4; color: #065f46; }
.adm-role.EMPLOYEE { background: #eff6ff; color: #1d4ed8; }

/* Quick actions */
.adm-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.adm-action-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 11px 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.01em;
}
.adm-action-btn.primary {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff;
  border: none;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.adm-action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99,102,241,0.4);
}
.adm-action-btn.secondary {
  background: #fff;
  color: #4338ca;
  border: 1.5px solid #e0e0f5;
}
.adm-action-btn.secondary:hover {
  background: #f0f4ff;
  border-color: #c7d2fe;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, employees: 0, managers: 0, pendingLeaves: 0 });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const fetchData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      const leavesRes = await API.get("/admin/leaves");
      const users = usersRes.data;
      const leaves = leavesRes.data;
      const employees = users.filter(u => u.role === "EMPLOYEE").length;
      const managers = users.filter(u => u.role === "MANAGER").length;
      const pending = leaves.filter(l => l.status === "PENDING");
      setStats({ users: users.length, employees, managers, pendingLeaves: pending.length });
      setPendingLeaves(pending.slice(0, 5));
      setRecentUsers(users.slice(-5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { label: "Total Users", value: stats.users, icon: "👥", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Employees", value: stats.employees, icon: "🧑‍💼", bg: "#f0fdf4", color: "#065f46" },
    { label: "Managers", value: stats.managers, icon: "🏢", bg: "#fffbeb", color: "#92400e" },
    { label: "Pending Leaves", value: stats.pendingLeaves, icon: "⏳", bg: "#fef2f2", color: "#991b1b" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="adm-root">
        <Navbar />
        <div className="adm-body">

          {/* Header */}
          <div className="adm-page-header">
            <div className="adm-page-title">Admin Dashboard</div>
            <div className="adm-page-sub">Overview of users, leave requests, and system activity</div>
          </div>

          {/* Stats */}
          <div className="adm-stats">
            {statCards.map((s, i) => (
              <div className="adm-stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="adm-stat-icon" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <div className="adm-stat-label">{s.label}</div>
                  <div className="adm-stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Leaves Table */}
          <div className="adm-section">
            <div className="adm-section-header">
              <div className="adm-section-title">Pending Leave Requests</div>
              <div className="adm-section-count">{pendingLeaves.length} pending</div>
            </div>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "28px" }}>No pending requests</td></tr>
                ) : pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="adm-emp-name">{leave.employeeName}</div>
                      <div className="adm-emp-id">ID: {leave.employeeId}</div>
                    </td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>
                      <span className={`adm-badge ${leave.status}`}>
                        <span className="adm-badge-dot" />
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Users Table */}
          <div className="adm-section">
            <div className="adm-section-header">
              <div className="adm-section-title">Recently Added Users</div>
              <div className="adm-section-count">{recentUsers.length} users</div>
            </div>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: "center", color: "#9ca3af", padding: "28px" }}>No users found</td></tr>
                ) : recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`adm-role ${u.role}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className="adm-section">
            <div className="adm-section-header">
              <div className="adm-section-title">Quick Actions</div>
            </div>
            <div className="adm-actions">
              <button className="adm-action-btn primary" onClick={() => navigate("/admin/users")}>
                👥 Manage Users
              </button>
              <button className="adm-action-btn secondary" onClick={() => navigate("/admin/leaves")}>
                📋 View All Leaves
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
