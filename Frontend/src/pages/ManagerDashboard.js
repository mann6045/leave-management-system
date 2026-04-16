import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mgr-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.mgr-body {
  padding: 36px 40px;
  max-width: 1280px;
  margin: 0 auto;
}

.mgr-page-header { margin-bottom: 32px; animation: fadeUp 0.4s ease both; }
.mgr-page-title { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.mgr-page-sub   { font-size: 14px; color: #9ca3af; font-weight: 500; }

/* Stats */
.mgr-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.mgr-stat-card {
  background: #fff;
  border-radius: 18px;
  padding: 24px 26px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06), 0 12px 32px rgba(99,102,241,0.04);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation: fadeUp 0.4s ease both;
  transition: transform 0.2s, box-shadow 0.2s;
}
.mgr-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99,102,241,0.1);
}
.mgr-stat-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.mgr-stat-label {
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; margin-bottom: 4px;
}
.mgr-stat-value {
  font-size: 34px; font-weight: 800;
  color: #1e1b4b; letter-spacing: -0.03em; line-height: 1;
}

/* Section */
.mgr-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  margin-bottom: 24px;
  animation: fadeUp 0.45s ease both;
}
.mgr-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.mgr-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; }
.mgr-section-badge {
  font-size: 12px; font-weight: 700; color: #b45309;
  background: #fef3c7; padding: 3px 10px; border-radius: 100px;
}

/* Analytics grid */
.mgr-analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.mgr-chart-box {
  background: #f8f9ff;
  border-radius: 14px;
  padding: 20px 20px 12px;
  border: 1px solid rgba(99,102,241,0.07);
}
.mgr-chart-box-title {
  font-size: 13px; font-weight: 700;
  color: #6b7280; text-transform: uppercase;
  letter-spacing: 0.07em; margin-bottom: 16px;
  display: flex; align-items: center; gap: 7px;
}

/* Custom tooltip */
.mgr-tooltip {
  background: #fff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  padding: 10px 16px;
  box-shadow: 0 4px 12px rgba(99,102,241,0.12);
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.mgr-tooltip-label {
  font-size: 11px; font-weight: 700; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px;
}
.mgr-tooltip-value {
  font-size: 20px; font-weight: 800; color: #1e1b4b;
}

/* Table */
.mgr-table { width: 100%; border-collapse: collapse; }
.mgr-table thead tr { border-bottom: 1px solid #f3f4f6; }
.mgr-table thead th {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; padding: 10px 14px; text-align: left;
}
.mgr-table tbody tr {
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}
.mgr-table tbody tr:last-child { border-bottom: none; }
.mgr-table tbody tr:hover { background: #fafbff; }
.mgr-table td { padding: 14px 14px; font-size: 14px; color: #374151; font-weight: 500; }

.mgr-emp-name { font-weight: 700; color: #1e1b4b; font-size: 14px; }
.mgr-emp-dept { font-size: 11px; color: #9ca3af; margin-top: 2px; }

/* Action buttons */
.mgr-approve-btn, .mgr-reject-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 16px; border-radius: 8px;
  cursor: pointer; transition: all 0.18s;
  letter-spacing: 0.02em; border: none;
}
.mgr-approve-btn { background: #d1fae5; color: #065f46; margin-right: 8px; }
.mgr-approve-btn:hover { background: #059669; color: #fff; box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
.mgr-reject-btn  { background: #fee2e2; color: #991b1b; }
.mgr-reject-btn:hover  { background: #dc2626; color: #fff; box-shadow: 0 4px 12px rgba(220,38,38,0.3); }

/* Quick actions */
.mgr-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.mgr-action-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700;
  padding: 11px 22px; border-radius: 10px;
  cursor: pointer; transition: all 0.18s;
}
.mgr-action-btn.primary {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; border: none; box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.mgr-action-btn.primary:hover  { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
.mgr-action-btn.secondary { background: #fff; color: #4338ca; border: 1.5px solid #e0e0f5; }
.mgr-action-btn.secondary:hover { background: #f0f4ff; border-color: #c7d2fe; }

.mgr-empty { text-align: center; color: #9ca3af; padding: 28px; font-size: 14px; }

/* Recharts legend override */
.recharts-legend-item-text {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #374151 !important;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const BAR_COLORS  = { Pending: "#f59e0b", Approved: "#10b981", Rejected: "#ef4444" };
const PIE_COLORS  = ["#6366f1", "#22c55e"];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="mgr-tooltip">
      <div className="mgr-tooltip-label">{label}</div>
      <div className="mgr-tooltip-value" style={{ color: BAR_COLORS[label] || "#6366f1" }}>
        {payload[0].value}
      </div>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="mgr-tooltip">
      <div className="mgr-tooltip-label">{payload[0].name}</div>
      <div className="mgr-tooltip-value">{payload[0].value}</div>
    </div>
  );
};

const CustomBarShape = (props) => {
  const { x, y, width, height, name } = props;
  return (
    <rect
      x={x} y={y} width={width} height={height}
      fill={BAR_COLORS[name] || "#6366f1"}
      rx={6} ry={6}
    />
  );
};

function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]         = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [teamStats, setTeamStats] = useState({ employees: 0, leaves: 0, pending: 0 });

  const fetchData = async () => {
    try {
      const res = await API.get("/manager/manager/all");
      const leaves   = res.data;
      const pending  = leaves.filter(l => l.status === "PENDING");
      const approved = leaves.filter(l => l.status === "APPROVED");
      const rejected = leaves.filter(l => l.status === "REJECTED");
      setStats({ total: leaves.length, pending: pending.length, approved: approved.length, rejected: rejected.length });
      setPendingLeaves(pending.slice(0, 5));
    } catch (err) { console.error(err); }

    try {
      const statsRes = await API.get("/manager/team-stats");
      setTeamStats(statsRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const approveLeave = async (id) => {
    try { await API.put("/manager/approve/" + id); fetchData(); } catch (err) { console.error(err); }
  };
  const rejectLeave = async (id) => {
    try { await API.put("/manager/reject/" + id); fetchData(); } catch (err) { console.error(err); }
  };

  const statCards = [
    { label: "Total Leaves",  value: stats.total,    icon: "📋", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Pending",       value: stats.pending,  icon: "⏳", bg: "#fffbeb", color: "#b45309" },
    { label: "Approved",      value: stats.approved, icon: "✅", bg: "#f0fdf4", color: "#065f46" },
    { label: "Rejected",      value: stats.rejected, icon: "❌", bg: "#fef2f2", color: "#991b1b" },
  ];

  const barData = [
    { name: "Pending",  value: stats.pending  },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ];

  const pieData = [
    { name: "Employees", value: teamStats.employees },
    { name: "Leaves",    value: teamStats.leaves    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="mgr-root">
        <Navbar />
        <div className="mgr-body">

          <div className="mgr-page-header">
            <div className="mgr-page-title">Manager Dashboard</div>
            <div className="mgr-page-sub">Review and manage your team's leave requests</div>
          </div>

          {/* Stats */}
          <div className="mgr-stats">
            {statCards.map((s, i) => (
              <div className="mgr-stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="mgr-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="mgr-stat-label">{s.label}</div>
                  <div className="mgr-stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Analytics Overview ── */}
          <div className="mgr-section">
            <div className="mgr-section-header">
              <div className="mgr-section-title">📊 Analytics Overview</div>
            </div>

            <div className="mgr-analytics-grid">

              {/* Bar Chart — Leave Status Breakdown */}
              <div className="mgr-chart-box">
                <div className="mgr-chart-box-title">
                  <span>📋</span> Leave Status Breakdown
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} barSize={52} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, fill: "#6b7280" }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fill: "#9ca3af" }}
                      axisLine={false} tickLine={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)", radius: 6 }} />
                    <Bar dataKey="value" shape={<CustomBarShape />} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart — Team Overview */}
              <div className="mgr-chart-box">
                <div className="mgr-chart-box-title">
                  <span>👥</span> Team Overview
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      strokeWidth={0}
                      label={({ name, percent }) =>
                        percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : ""
                      }
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={10}
                      formatter={(value, entry) => (
                        <span style={{
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                          fontSize: 13, fontWeight: 600, color: "#374151"
                        }}>
                          {value}
                          <span style={{ fontWeight: 800, color: "#1e1b4b", marginLeft: 6 }}>
                            {entry.payload.value}
                          </span>
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

          {/* Pending Leaves */}
          <div className="mgr-section">
            <div className="mgr-section-header">
              <div className="mgr-section-title">Pending Leave Requests</div>
              {stats.pending > 0 && (
                <div className="mgr-section-badge">⚡ {stats.pending} need action</div>
              )}
            </div>
            <table className="mgr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.length === 0 ? (
                  <tr><td colSpan={5} className="mgr-empty">🎉 No pending requests — all caught up!</td></tr>
                ) : pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="mgr-emp-name">{leave.employeeName}</div>
                      <div className="mgr-emp-dept">{leave.department}</div>
                    </td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>
                      <button className="mgr-approve-btn" onClick={() => approveLeave(leave.id)}>
                        ✓ Approve
                      </button>
                      <button className="mgr-reject-btn" onClick={() => rejectLeave(leave.id)}>
                        ✕ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className="mgr-section">
            <div className="mgr-section-header">
              <div className="mgr-section-title">Quick Actions</div>
            </div>
            <div className="mgr-actions">
              <button className="mgr-action-btn primary" onClick={() => navigate("/manager/panel")}>
                📋 View All Leaves
              </button>
              <button className="mgr-action-btn secondary" onClick={() => navigate("/manager/users")}>
                👥 Manage Employees
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ManagerDashboard;