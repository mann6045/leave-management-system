import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.allv-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.allv-body {
  padding: 36px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.allv-page-header { margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
.allv-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.allv-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

/* Filter bar */
.allv-filter-bar {
  display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;
  animation: fadeUp 0.42s ease both;
}
.allv-filter-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 8px 18px; border-radius: 100px;
  border: 1.5px solid #e5e7eb;
  background: #fff; color: #6b7280;
  cursor: pointer; transition: all 0.18s;
}
.allv-filter-btn:hover { border-color: #a5b4fc; color: #4338ca; background: #f0f4ff; }
.allv-filter-btn.active { background: #4338ca; color: #fff; border-color: #4338ca; box-shadow: 0 4px 12px rgba(67,56,202,0.25); }

/* Search + type row */
.allv-search-row {
  display: flex; gap: 10px; flex-wrap: wrap;
  margin-bottom: 20px;
  animation: fadeUp 0.44s ease both;
}
.allv-search-input {
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
.allv-search-input::placeholder { color: #d1d5db; }
.allv-search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.allv-type-select {
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
  transition: border 0.2s, box-shadow 0.2s;
}
.allv-type-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

/* Section card */
.allv-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: fadeUp 0.45s ease both;
}
.allv-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.allv-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; }
.allv-count { font-size: 12px; font-weight: 700; color: #6366f1; background: #ede9fe; padding: 3px 10px; border-radius: 100px; }

/* Table */
.allv-table { width: 100%; border-collapse: collapse; }
.allv-table thead tr { border-bottom: 1px solid #f3f4f6; }
.allv-table thead th {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; padding: 10px 12px; text-align: left;
}
.allv-table tbody tr {
  border-bottom: 1px solid #f9fafb; transition: background 0.15s;
}
.allv-table tbody tr:last-child { border-bottom: none; }
.allv-table tbody tr:hover { background: #fafbff; }
.allv-table td { padding: 13px 12px; font-size: 14px; color: #374151; font-weight: 500; }

.allv-emp-name { font-weight: 700; color: #1e1b4b; font-size: 14px; }
.allv-emp-id   { font-size: 11px; color: #9ca3af; margin-top: 2px; }

.allv-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
}
.allv-badge.PENDING  { background: #fef3c7; color: #92400e; }
.allv-badge.APPROVED { background: #d1fae5; color: #065f46; }
.allv-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.allv-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.allv-approve-btn, .allv-reject-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 14px; border-radius: 8px;
  cursor: pointer; transition: all 0.18s; border: none;
}
.allv-approve-btn { background: #d1fae5; color: #065f46; margin-right: 8px; }
.allv-approve-btn:hover:not(:disabled) { background: #059669; color: #fff; box-shadow: 0 3px 10px rgba(5,150,105,0.3); }
.allv-approve-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.allv-reject-btn  { background: #fee2e2; color: #991b1b; }
.allv-reject-btn:hover:not(:disabled) { background: #dc2626; color: #fff; box-shadow: 0 3px 10px rgba(220,38,38,0.3); }
.allv-reject-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.allv-empty { text-align: center; color: #9ca3af; padding: 40px; font-size: 14px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function AllLeaves() {
  // ── ALL hooks must be inside the component ──────────────────────────────
  const [leaves, setLeaves]               = useState([]);
  const [filter, setFilter]               = useState("ALL");
  const [search, setSearch]               = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("ALL");

  // ── Data fetching ────────────────────────────────────────────────────────
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/admin/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  // ── Actions ──────────────────────────────────────────────────────────────
  const approveLeave = async (id) => {
    try { await API.put("/manager/approve/" + id); fetchLeaves(); }
    catch (err) { console.error(err); }
  };

  const rejectLeave = async (id) => {
    try { await API.put("/manager/reject/" + id); fetchLeaves(); }
    catch (err) { console.error(err); }
  };

  // ── Filtering logic ──────────────────────────────────────────────────────
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

  const countBy = (status) => leaves.filter(l => l.status === status).length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="allv-root">
        <Navbar />
        <div className="allv-body">

          {/* Header */}
          <div className="allv-page-header">
            <div className="allv-page-title">All Leave Requests</div>
            <div className="allv-page-sub">Review and manage leave requests across the organisation</div>
          </div>

          {/* Status filter pills */}
          <div className="allv-filter-bar">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`allv-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL"      ? `All (${leaves.length})`
                  : f === "PENDING"  ? `⏳ Pending (${countBy("PENDING")})`
                  : f === "APPROVED" ? `✅ Approved (${countBy("APPROVED")})`
                  : `❌ Rejected (${countBy("REJECTED")})`}
              </button>
            ))}
          </div>

          {/* Search + leave type filter */}
          <div className="allv-search-row">
            <input
              className="allv-search-input"
              placeholder="🔍  Search by name or employee ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="allv-type-select"
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Table */}
          <div className="allv-section">
            <div className="allv-section-header">
              <div className="allv-section-title">Leave Requests</div>
              <div className="allv-count">{filtered.length} records</div>
            </div>

            <table className="allv-table">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="allv-empty">
                      {search || leaveTypeFilter !== "ALL"
                        ? "🔍 No results match your search"
                        : "No leave requests found"}
                    </td>
                  </tr>
                ) : filtered.map((l) => (
                  <tr key={l.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 600 }}>#{l.id}</td>
                    <td>
                      <div className="allv-emp-name">{l.employeeName || "Employee"}</div>
                      <div className="allv-emp-id">ID: {l.employeeId}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{l.leaveType}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td><span style={{ fontWeight: 700, color: "#6366f1" }}>{l.days}</span></td>
                    <td style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.reason || "—"}
                    </td>
                    <td>
                      <span className={`allv-badge ${l.status}`}>
                        <span className="allv-badge-dot" />
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="allv-approve-btn"
                        disabled={l.status === "APPROVED"}
                        onClick={() => approveLeave(l.id)}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="allv-reject-btn"
                        disabled={l.status === "REJECTED"}
                        onClick={() => rejectLeave(l.id)}
                      >
                        ✕ Reject
                      </button>
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

export default AllLeaves;
