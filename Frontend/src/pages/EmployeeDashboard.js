import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import LeaveChart from "../components/LeaveChart";
import MonthlyChart from "../components/MonthlyChart";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.emp-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.emp-body {
  padding: 36px 40px 56px;
  max-width: 1280px;
  margin: 0 auto;
}

/* ── Page header ── */
.emp-page-header {
  margin-bottom: 28px;
  animation: fadeUp 0.38s ease both;
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.emp-page-title { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 3px; }
.emp-page-sub   { font-size: 14px; color: #9ca3af; font-weight: 500; }
.emp-page-date  {
  font-size: 13px; font-weight: 600; color: #6b7280;
  background: #fff; border: 1px solid #e8eaf6;
  padding: 6px 16px; border-radius: 100px;
  white-space: nowrap;
}

/* ── Profile banner ── */
.emp-profile-card {
  background: linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%);
  border-radius: 20px; padding: 28px 32px;
  margin-bottom: 28px;
  display: flex; align-items: center; gap: 22px;
  animation: fadeUp 0.4s ease both;
  box-shadow: 0 8px 32px rgba(99,102,241,0.28);
  position: relative; overflow: hidden;
}
.emp-profile-card::before {
  content: '';
  position: absolute; top: -60px; right: -60px;
  width: 220px; height: 220px; border-radius: 50%;
  background: rgba(255,255,255,0.07); pointer-events: none;
}
.emp-profile-card::after {
  content: '';
  position: absolute; bottom: -40px; left: 30%;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,0.05); pointer-events: none;
}
.emp-avatar {
  width: 64px; height: 64px; border-radius: 18px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: #fff;
  flex-shrink: 0; letter-spacing: -0.02em;
  backdrop-filter: blur(8px);
  position: relative; z-index: 1;
  overflow: hidden;
}
.emp-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }
.emp-profile-info { position: relative; z-index: 1; flex: 1; min-width: 0; }
.emp-profile-name {
  font-size: 20px; font-weight: 800; color: #fff;
  letter-spacing: -0.02em; margin-bottom: 8px;
}
.emp-profile-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.emp-profile-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.88);
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.22);
  padding: 4px 12px; border-radius: 100px;
  backdrop-filter: blur(4px);
}
.emp-profile-actions { position: relative; z-index: 1; display: flex; gap: 10px; flex-shrink: 0; }
.emp-profile-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 9px 20px; border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.15); color: #fff;
  cursor: pointer; transition: all 0.18s;
  backdrop-filter: blur(4px); white-space: nowrap;
}
.emp-profile-btn:hover { background: rgba(255,255,255,0.28); border-color: rgba(255,255,255,0.65); }
.emp-profile-btn.solid {
  background: #fff; color: #4338ca; border-color: #fff;
}
.emp-profile-btn.solid:hover { background: #eef2ff; }

/* ── Stats row ── */
.emp-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 18px; margin-bottom: 24px;
}
.emp-stat-card {
  background: #fff; border-radius: 18px; padding: 22px 22px 18px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  display: flex; flex-direction: column; gap: 14px;
  animation: fadeUp 0.4s ease both;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}
.emp-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(99,102,241,0.12); }
.emp-stat-top { display: flex; align-items: center; justify-content: space-between; }
.emp-stat-icon {
  width: 44px; height: 44px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.emp-stat-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 4px;
}
.emp-stat-value {
  font-size: 34px; font-weight: 800; color: #1e1b4b;
  letter-spacing: -0.03em; line-height: 1;
}

/* ── Chart row ── */
.emp-chart-row {
  display: grid; grid-template-columns: 1fr 340px;
  gap: 20px; margin-bottom: 24px; align-items: stretch;
}
.emp-chart-card {
  background: #fff; border-radius: 18px; padding: 26px 28px 20px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  animation: fadeUp 0.45s ease both;
  display: flex; flex-direction: column;
}
.emp-chart-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.emp-chart-title { font-size: 15px; font-weight: 700; color: #1e1b4b; }
.emp-chart-sub   { font-size: 12px; color: #9ca3af; font-weight: 500; margin-top: 2px; }

/* ── Monthly chart wrapper ── */
.emp-monthly-wrap {
  background: #fff; border-radius: 18px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  margin-bottom: 24px; animation: fadeUp 0.46s ease both;
  padding: 28px;
}
.emp-monthly-header { margin-bottom: 20px; }
.emp-monthly-title { font-size: 15px; font-weight: 700; color: #1e1b4b; }
.emp-monthly-sub   { font-size: 12px; color: #9ca3af; font-weight: 500; margin-top: 2px; }

/* ── Section card ── */
.emp-section {
  background: #fff; border-radius: 18px; padding: 26px 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  margin-bottom: 20px; animation: fadeUp 0.47s ease both;
}
.emp-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.emp-section-title  { font-size: 15px; font-weight: 700; color: #1e1b4b; }
.emp-section-count  {
  font-size: 12px; font-weight: 700; color: #6366f1;
  background: #ede9fe; padding: 3px 10px; border-radius: 100px;
}
.emp-section-link {
  font-size: 12px; font-weight: 700; color: #6366f1;
  background: none; border: none; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 0; text-decoration: none;
}
.emp-section-link:hover { color: #4338ca; text-decoration: underline; }

/* ── Table ── */
.emp-table { width: 100%; border-collapse: collapse; }
.emp-table thead tr { border-bottom: 1px solid #f3f4f6; }
.emp-table thead th {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #9ca3af; padding: 10px 14px; text-align: left;
}
.emp-table tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
.emp-table tbody tr:last-child { border-bottom: none; }
.emp-table tbody tr:hover { background: #fafbff; }
.emp-table td { padding: 13px 14px; font-size: 14px; color: #374151; font-weight: 500; }

/* Balance bar */
.emp-balance-row { display: flex; align-items: center; gap: 10px; }
.emp-progress-bar { flex: 1; height: 6px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
.emp-progress-fill {
  height: 100%; border-radius: 100px;
  background: linear-gradient(90deg, #4338ca, #6366f1);
  transition: width 0.7s ease;
}
.emp-balance-label { font-size: 12px; font-weight: 700; color: #6366f1; white-space: nowrap; min-width: 36px; text-align: right; }

/* Status badge */
.emp-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px;
}
.emp-badge.PENDING  { background: #fef3c7; color: #92400e; }
.emp-badge.APPROVED { background: #d1fae5; color: #065f46; }
.emp-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.emp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Quick actions */
.emp-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.emp-action-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; padding: 12px 22px;
  border-radius: 10px; cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; gap: 8px;
}
.emp-action-btn.primary {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; border: none; box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.emp-action-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(99,102,241,0.4); }
.emp-action-btn.secondary { background: #fff; color: #4338ca; border: 1.5px solid #e0e0f5; }
.emp-action-btn.secondary:hover { background: #f0f4ff; border-color: #c7d2fe; }

.emp-empty { text-align: center; color: #9ca3af; padding: 32px; font-size: 14px; }

/* Leave type pill in table */
.emp-leave-type-pill {
  display: inline-flex; align-items: center;
  background: #f0f4ff; color: #4338ca;
  font-size: 12px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const BAR_COLORS = {
  Total:    "#6366f1",
  Approved: "#10b981",
  Pending:  "#f59e0b",
  Rejected: "#ef4444",
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e0e7ff", borderRadius: 10,
      padding: "10px 16px", boxShadow: "0 4px 12px rgba(99,102,241,0.1)",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: BAR_COLORS[label] || "#1e1b4b" }}>
        {payload[0].value}
      </div>
    </div>
  );
};

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile]   = useState({});
  const [stats, setStats]       = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves]     = useState([]);

  const fetchProfile = useCallback(async () => {
    try { const res = await API.get("/users/me"); setProfile(res.data); } catch (err) { console.log(err); }
  }, []);
  const fetchStats = useCallback(async () => {
    try { const res = await API.get("/leaves/stats"); setStats(res.data); } catch (err) { console.log(err); }
  }, []);
  const fetchBalances = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await API.get(`/leaves/balance/${userId}`);
      setBalances(res.data);
    } catch (err) { console.log(err); }
  }, []);
  const fetchRecentLeaves = useCallback(async () => {
    try { const res = await API.get("/leaves/my"); setLeaves(res.data); } catch (err) { console.log(err); }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchBalances();
    fetchRecentLeaves();
  }, [fetchProfile, fetchStats, fetchBalances, fetchRecentLeaves]);

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  const profileImage = profile?.profileImage
    ? `http://localhost:8080/uploads/${profile.profileImage}`
    : null;

  const statCards = [
    { label: "Total Leaves",  value: stats.total,    icon: "📋", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Pending",       value: stats.pending,  icon: "⏳", bg: "#fffbeb", color: "#b45309" },
    { label: "Approved",      value: stats.approved, icon: "✅", bg: "#f0fdf4", color: "#065f46" },
    { label: "Rejected",      value: stats.rejected, icon: "❌", bg: "#fef2f2", color: "#991b1b" },
  ];

  const chartData = [
    { name: "Total",    value: stats.total    },
    { name: "Approved", value: stats.approved },
    { name: "Pending",  value: stats.pending  },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="emp-root">
        <Navbar />
        <div className="emp-body">

          {/* ── Page header ── */}
          <div className="emp-page-header">
            <div>
              <div className="emp-page-title">Employee Dashboard</div>
              <div className="emp-page-sub">Your leave summary and recent activity</div>
            </div>
            <div className="emp-page-date">📅 {today}</div>
          </div>

          {/* ── Profile banner ── */}
          <div className="emp-profile-card">
            <div className="emp-avatar">
              {profileImage
                ? <img src={profileImage} alt={profile?.name || "avatar"} />
                : initials
              }
            </div>
            <div className="emp-profile-info">
              <div className="emp-profile-name">{profile?.name || "—"}</div>
              <div className="emp-profile-meta">
                <span className="emp-profile-chip">✉ {profile?.email || "—"}</span>
                <span className="emp-profile-chip">🏢 {profile?.department || "—"}</span>
                <span className="emp-profile-chip">🪪 ID: {profile?.id || "—"}</span>
              </div>
            </div>
            <div className="emp-profile-actions">
              <button className="emp-profile-btn solid" onClick={() => navigate("/apply")}>
                📝 Apply Leave
              </button>
              <button className="emp-profile-btn" onClick={() => navigate("/profile")}>
                ✏ Edit Profile
              </button>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="emp-stats">
            {statCards.map((s, i) => (
              <div className="emp-stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="emp-stat-top">
                  <div className="emp-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                </div>
                <div>
                  <div className="emp-stat-label">{s.label}</div>
                  <div className="emp-stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts: bar (left) + donut (right) ── */}
          <div className="emp-chart-row">

            <div className="emp-chart-card">
              <div className="emp-chart-header">
                <div>
                  <div className="emp-chart-title">Leave Overview</div>
                  <div className="emp-chart-sub">All-time leave breakdown by status</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={chartData} barSize={44}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 13, fontWeight: 600, fill: "#6b7280" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false} width={32}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)", radius: 8 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={BAR_COLORS[entry.name] || "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="emp-chart-card">
              <div className="emp-chart-header">
                <div>
                  <div className="emp-chart-title">Leave Distribution</div>
                  <div className="emp-chart-sub">Status breakdown</div>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LeaveChart hideHeader />
              </div>
            </div>

          </div>

          {/* ── Monthly trend ── */}
          <div className="emp-monthly-wrap">
            <div className="emp-monthly-header">
              <div className="emp-monthly-title">Monthly Leave Trends</div>
              <div className="emp-monthly-sub">Leave applications across the year</div>
            </div>
            <MonthlyChart embedded />
          </div>

          {/* ── Leave Balance ── */}
          <div className="emp-section">
            <div className="emp-section-header">
              <div className="emp-section-title">Leave Balance</div>
              <span className="emp-section-count">{balances.length} types</span>
            </div>
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Total</th>
                  <th>Used</th>
                  <th>Remaining</th>
                  <th style={{ minWidth: 160 }}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {balances.length === 0 ? (
                  <tr><td colSpan={5} className="emp-empty">No balance data available</td></tr>
                ) : balances.map((b) => {
                  const pct = b.totalLeave > 0 ? Math.round((b.usedLeave / b.totalLeave) * 100) : 0;
                  const fillColor = pct >= 80 ? "#ef4444" : pct >= 50 ? "#f59e0b" : "#6366f1";
                  return (
                    <tr key={b.id}>
                      <td>
                        <span className="emp-leave-type-pill">{b.leaveType}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.totalLeave}</td>
                      <td style={{ fontWeight: 600 }}>{b.usedLeave}</td>
                      <td style={{ fontWeight: 700, color: "#4338ca" }}>{b.remainingLeave}</td>
                      <td>
                        <div className="emp-balance-row">
                          <div className="emp-progress-bar">
                            <div
                              className="emp-progress-fill"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${fillColor}cc, ${fillColor})`,
                              }}
                            />
                          </div>
                          <span className="emp-balance-label" style={{ color: fillColor }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Recent Leave Requests ── */}
          <div className="emp-section">
            <div className="emp-section-header">
              <div className="emp-section-title">Recent Leave Requests</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="emp-section-count">{Math.min(leaves.length, 5)} of {leaves.length}</span>
                {leaves.length > 5 && (
                  <button className="emp-section-link" onClick={() => navigate("/history")}>
                    View all →
                  </button>
                )}
              </div>
            </div>
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan={5} className="emp-empty">No leave requests yet</td></tr>
                ) : leaves.slice(0, 5).map((leave) => {
                  const days = leave.startDate && leave.endDate
                    ? Math.max(1, Math.round((new Date(leave.endDate) - new Date(leave.startDate)) / 86400000) + 1)
                    : "—";
                  return (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>
                        <span style={{
                          background: "#f0f4ff", color: "#4338ca",
                          fontSize: 12, fontWeight: 700,
                          padding: "3px 9px", borderRadius: 100,
                        }}>
                          {days}d
                        </span>
                      </td>
                      <td>
                        <span className={`emp-badge ${leave.status}`}>
                          <span className="emp-badge-dot" />
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Quick Actions ── */}
          <div className="emp-section">
            <div className="emp-section-header">
              <div className="emp-section-title">Quick Actions</div>
            </div>
            <div className="emp-actions">
              <button className="emp-action-btn primary" onClick={() => navigate("/apply")}>
                📝 Apply Leave
              </button>
              <button className="emp-action-btn secondary" onClick={() => navigate("/history")}>
                📂 Leave History
              </button>
              <button className="emp-action-btn secondary" onClick={() => navigate("/calendar")}>
                📅 Leave Calendar
              </button>
              <button className="emp-action-btn secondary" onClick={() => navigate("/profile")}>
                👤 My Profile
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;