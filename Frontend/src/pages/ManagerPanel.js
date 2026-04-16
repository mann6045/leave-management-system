import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mp-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.mp-body {
  padding: 36px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.mp-page-header { margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
.mp-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.mp-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

/* Search row */
.mp-search-row {
  display: flex; gap: 10px; flex-wrap: wrap;
  margin-bottom: 16px;
  animation: fadeUp 0.41s ease both;
}
.mp-search-input {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #1e1b4b;
  outline: none;
  min-width: 220px;
  transition: border 0.2s, box-shadow 0.2s;
}
.mp-search-input::placeholder { color: #d1d5db; }
.mp-search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.mp-type-select {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  padding: 10px 36px 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-color: #fff;
  transition: border 0.2s, box-shadow 0.2s;
}
.mp-type-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

/* Filter bar */
.mp-filter-bar {
  display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
  animation: fadeUp 0.42s ease both;
}
.mp-filter-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 8px 18px; border-radius: 100px;
  border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
  cursor: pointer; transition: all 0.18s;
}
.mp-filter-btn:hover { border-color: #a5b4fc; color: #4338ca; background: #f0f4ff; }
.mp-filter-btn.active { background: #4338ca; color: #fff; border-color: #4338ca; box-shadow: 0 4px 12px rgba(67,56,202,0.25); }

/* Section card */
.mp-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: fadeUp 0.45s ease both;
}
.mp-section-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
}
.mp-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; }
.mp-count  { font-size: 12px; font-weight: 700; color: #6366f1; background: #ede9fe; padding: 3px 10px; border-radius: 100px; }
.mp-urgent { font-size: 12px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 3px 10px; border-radius: 100px; }

/* Table */
.mp-table { width: 100%; border-collapse: collapse; }
.mp-table thead tr { border-bottom: 1px solid #f3f4f6; }
.mp-table thead th {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; padding: 10px 12px; text-align: left;
}
.mp-table tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
.mp-table tbody tr:last-child { border-bottom: none; }
.mp-table tbody tr:hover { background: #fafbff; }
.mp-table td { padding: 13px 12px; font-size: 14px; color: #374151; font-weight: 500; }

.mp-emp-name { font-weight: 700; color: #1e1b4b; }
.mp-emp-id   { font-size: 11px; color: #9ca3af; margin-top: 2px; }

.mp-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
}
.mp-badge.PENDING  { background: #fef3c7; color: #92400e; }
.mp-badge.APPROVED { background: #d1fae5; color: #065f46; }
.mp-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.mp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.mp-remaining {
  display: inline-block;
  font-weight: 700; font-size: 14px; color: #4338ca;
  background: #ede9fe; padding: 3px 10px; border-radius: 8px;
}

.mp-approve-btn, .mp-reject-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 14px; border-radius: 8px;
  cursor: pointer; transition: all 0.18s; border: none;
}
.mp-approve-btn { background: #d1fae5; color: #065f46; margin-right: 8px; }
.mp-approve-btn:hover { background: #059669; color: #fff; box-shadow: 0 3px 10px rgba(5,150,105,0.3); }
.mp-reject-btn  { background: #fee2e2; color: #991b1b; }
.mp-reject-btn:hover { background: #dc2626; color: #fff; box-shadow: 0 3px 10px rgba(220,38,38,0.3); }

.mp-empty { text-align: center; color: #9ca3af; padding: 40px; font-size: 14px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function ManagerPanel() {
  // ── ALL hooks inside the component ──────────────────────────────────────
  const [leaves, setLeaves]                   = useState([]);
  const [balances, setBalances]               = useState({});
  const [filter, setFilter]                   = useState("ALL");
  const [search, setSearch]                   = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("ALL");

  // ── Data fetching ────────────────────────────────────────────────────────
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await API.get("manager/manager/all");
      setLeaves(res.data);
      fetchBalances(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchBalances = async (leaveList) => {
    let map = {};
    for (let leave of leaveList) {
      try {
        const res = await API.get(`/leaves/balance/${leave.employeeId}`);
        const balance = res.data.find(b => b.leaveType === leave.leaveType);
        map[leave.id] = balance?.remainingLeave ?? "-";
      } catch { map[leave.id] = "-"; }
    }
    setBalances(map);
  };

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const approveLeave = async (id) => { await API.put("/leaves/manager/approve/" + id); fetchLeaves(); };
  const rejectLeave  = async (id) => { await API.put("/leaves/manager/reject/"  + id); fetchLeaves(); };

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = leaves.filter((l) => {
    if (filter !== "ALL" && l.status !== filter) return false;
    if (
      search &&
      !(
        l.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        String(l.employeeId).includes(search)
      )
    ) return false;
    if (leaveTypeFilter !== "ALL" && l.leaveType !== leaveTypeFilter) return false;
    return true;
  });

  const countBy      = (s) => leaves.filter(l => l.status === s).length;
  const pendingCount = countBy("PENDING");

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="mp-root">
        <Navbar />
        <div className="mp-body">

          {/* Header */}
          <div className="mp-page-header">
            <div className="mp-page-title">Manager Leave Panel</div>
            <div className="mp-page-sub">Review, approve, or reject your team's leave requests</div>
          </div>

          {/* Search + leave type */}
          <div className="mp-search-row">
            <input
              className="mp-search-input"
              placeholder="🔍  Search by name or employee ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="mp-type-select"
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Status filter pills */}
          <div className="mp-filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`mp-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL"      ? `All (${leaves.length})`
                  : f === "PENDING"  ? `⏳ Pending (${countBy("PENDING")})`
                  : f === "APPROVED" ? `✅ Approved (${countBy("APPROVED")})`
                  : `❌ Rejected (${countBy("REJECTED")})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="mp-section">
            <div className="mp-section-header">
              <div className="mp-section-title">Leave Requests</div>
              {pendingCount > 0
                ? <div className="mp-urgent">⚡ {pendingCount} need action</div>
                : <div className="mp-count">{filtered.length} records</div>
              }
            </div>

            <table className="mp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Remaining</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="mp-empty">
                      {search || leaveTypeFilter !== "ALL"
                        ? "🔍 No results match your search"
                        : "🎉 No requests in this category"}
                    </td>
                  </tr>
                ) : filtered.map((leave) => (
                  <tr key={leave.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 600 }}>#{leave.id}</td>
                    <td>
                      <div className="mp-emp-name">{leave.employeeName || "Employee"}</div>
                      <div className="mp-emp-id">ID: {leave.employeeId}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td><span style={{ fontWeight: 700, color: "#6366f1" }}>{leave.days}</span></td>
                    <td style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {leave.reason || "—"}
                    </td>
                    <td>
                      <span className={`mp-badge ${leave.status}`}>
                        <span className="mp-badge-dot" />
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <span className="mp-remaining">{balances[leave.id] ?? "—"}</span>
                    </td>
                    <td>
                      <button className="mp-approve-btn" onClick={() => approveLeave(leave.id)}>✓ Approve</button>
                      <button className="mp-reject-btn"  onClick={() => rejectLeave(leave.id)}>✕ Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default ManagerPanel;
