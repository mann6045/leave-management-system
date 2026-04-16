import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.lh-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.lh-body {
  padding: 36px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.lh-page-header { margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
.lh-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.lh-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

.lh-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: fadeUp 0.45s ease both;
}
.lh-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.lh-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; }
.lh-count-badge {
  font-size: 12px; font-weight: 700; color: #6366f1;
  background: #ede9fe; padding: 3px 10px; border-radius: 100px;
}

/* Table */
.lh-table { width: 100%; border-collapse: collapse; }
.lh-table thead tr { border-bottom: 1px solid #f3f4f6; }
.lh-table thead th {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; padding: 10px 14px; text-align: left;
}
.lh-table tbody tr {
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}
.lh-table tbody tr:last-child { border-bottom: none; }
.lh-table tbody tr:hover { background: #fafbff; }
.lh-table td { padding: 14px 14px; font-size: 14px; color: #374151; font-weight: 500; }

/* Status badge */
.lh-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
}
.lh-badge.PENDING  { background: #fef3c7; color: #92400e; }
.lh-badge.APPROVED { background: #d1fae5; color: #065f46; }
.lh-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.lh-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Actions */
.lh-edit-btn, .lh-cancel-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 14px; border-radius: 8px;
  cursor: pointer; transition: all 0.18s;
}
.lh-edit-btn {
  background: #eff6ff; color: #1d4ed8;
  border: 1.5px solid #bfdbfe; margin-right: 8px;
}
.lh-edit-btn:hover { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.lh-cancel-btn {
  background: #fee2e2; color: #991b1b;
  border: 1.5px solid #fca5a5;
}
.lh-cancel-btn:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

.lh-empty { text-align: center; color: #9ca3af; padding: 40px; font-size: 14px; }

/* Modal overlay */
.lh-overlay {
  position: fixed; inset: 0;
  background: rgba(30,27,75,0.35);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}
.lh-modal {
  background: #fff;
  border-radius: 20px;
  padding: 36px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 24px 80px rgba(30,27,75,0.25);
  border: 1px solid rgba(99,102,241,0.1);
  animation: modalPop 0.25s cubic-bezier(0.22,1,0.36,1);
}
.lh-modal-title {
  font-size: 20px; font-weight: 800; color: #1e1b4b;
  letter-spacing: -0.02em; margin-bottom: 24px;
}
.lh-modal-field { margin-bottom: 18px; }
.lh-modal-label {
  display: block; font-size: 12px; font-weight: 700;
  color: #6b7280; margin-bottom: 8px;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.lh-modal-input, .lh-modal-textarea {
  width: 100%;
  background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 11px; padding: 12px 14px;
  font-size: 14px; color: #1e1b4b;
  outline: none; font-family: inherit; font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.lh-modal-input:focus, .lh-modal-textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.lh-modal-textarea { resize: vertical; min-height: 80px; }
.lh-modal-actions { display: flex; gap: 10px; margin-top: 24px; }
.lh-modal-cancel-btn {
  flex: 1; padding: 12px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; background: #fff;
  font-family: inherit; font-size: 14px; font-weight: 700;
  color: #6b7280; cursor: pointer; transition: all 0.18s;
}
.lh-modal-cancel-btn:hover { background: #f3f4f6; }
.lh-modal-update-btn {
  flex: 2; padding: 12px; border-radius: 10px;
  border: none; background: linear-gradient(135deg,#4338ca,#6366f1);
  color: #fff; font-family: inherit; font-size: 14px;
  font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  transition: all 0.18s;
}
.lh-modal-update-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes modalPop {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

function LeaveHistory() {
  const [leaves, setLeaves]       = useState([]);
  const [open, setOpen]           = useState(false);
  const [selected, setSelected]   = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [reason, setReason]       = useState("");

  const fetchLeaves = async () => {
    const res = await API.get("/leaves/my");
    setLeaves(res.data);
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleEdit = (leave) => {
    setSelected(leave);
    setStartDate(leave.startDate);
    setEndDate(leave.endDate);
    setReason(leave.reason);
    setOpen(true);
  };

  const updateLeave = async () => {
    await API.put("/leaves/update/" + selected.id, { startDate, endDate, reason });
    setOpen(false);
    fetchLeaves();
  };

  const cancelLeave = async (id) => {
    if (window.confirm("Cancel this leave request?")) {
      await API.delete("/leaves/cancel/" + id);
      fetchLeaves();
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lh-root">
        <Navbar />
        <div className="lh-body">

          <div className="lh-page-header">
            <div className="lh-page-title">Leave History</div>
            <div className="lh-page-sub">Track and manage all your leave requests</div>
          </div>

          <div className="lh-section">
            <div className="lh-section-header">
              <div className="lh-section-title">All Requests</div>
              <div className="lh-count-badge">{leaves.length} total</div>
            </div>

            <table className="lh-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan={7} className="lh-empty">📋 No leave requests found</td></tr>
                ) : leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#6366f1" }}>{leave.days}</span>
                    </td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {leave.reason || "—"}
                    </td>
                    <td>
                      <span className={`lh-badge ${leave.status}`}>
                        <span className="lh-badge-dot" />
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === "PENDING" && (
                        <>
                          <button className="lh-edit-btn" onClick={() => handleEdit(leave)}>✏ Edit</button>
                          <button className="lh-cancel-btn" onClick={() => cancelLeave(leave.id)}>✕ Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {open && (
        <div className="lh-overlay" onClick={() => setOpen(false)}>
          <div className="lh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lh-modal-title">✏ Edit Leave Request</div>

            <div className="lh-modal-field">
              <label className="lh-modal-label">Start Date</label>
              <input className="lh-modal-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="lh-modal-field">
              <label className="lh-modal-label">End Date</label>
              <input className="lh-modal-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="lh-modal-field">
              <label className="lh-modal-label">Reason</label>
              <textarea className="lh-modal-textarea" placeholder="Update your reason…" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>

            <div className="lh-modal-actions">
              <button className="lh-modal-cancel-btn" onClick={() => setOpen(false)}>Cancel</button>
              <button className="lh-modal-update-btn" onClick={updateLeave}>Update Request →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeaveHistory;
