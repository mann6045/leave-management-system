import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.al-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.al-body {
  padding: 36px 40px 64px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Page header ── */
.al-page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  margin-bottom: 32px;
  animation: alFade 0.38s ease both;
}
.al-page-title { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 3px; }
.al-page-sub   { font-size: 14px; color: #9ca3af; font-weight: 500; }
.al-page-date  {
  font-size: 13px; font-weight: 600; color: #6b7280;
  background: #fff; border: 1px solid #e8eaf6;
  padding: 6px 14px; border-radius: 100px;
}

/* ── Two-column grid ── */
.al-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

/* ── Card ── */
.al-card {
  background: #fff; border-radius: 20px;
  padding: 36px; border: 1px solid rgba(99,102,241,0.09);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06), 0 20px 48px rgba(99,102,241,0.06);
  animation: alFade 0.44s ease both;
}
.al-card-title {
  font-size: 16px; font-weight: 800; color: #1e1b4b;
  margin-bottom: 28px; display: flex; align-items: center; gap: 8px;
}

/* ── Leave type grid ── */
.al-type-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  margin-bottom: 4px;
}
.al-type-card {
  border: 2px solid #e5e7eb; border-radius: 14px;
  padding: 18px 16px; cursor: pointer;
  transition: all 0.18s; background: #f8f9ff;
  display: flex; align-items: flex-start; gap: 12px;
}
.al-type-card:hover { border-color: #a5b4fc; background: #f5f3ff; transform: translateY(-1px); }
.al-type-card.selected {
  border-color: #6366f1; background: #eef2ff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
  transform: translateY(-1px);
}
.al-type-icon-wrap {
  width: 40px; height: 40px; border-radius: 11px;
  background: #ede9fe; display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.al-type-card.selected .al-type-icon-wrap { background: #c7d2fe; }
.al-type-label { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 2px; }
.al-type-sub   { font-size: 12px; color: #9ca3af; line-height: 1.4; }
.al-type-bal   {
  font-size: 11px; font-weight: 700; color: #4338ca;
  background: #eef2ff; padding: 2px 8px; border-radius: 100px;
  margin-top: 6px; display: inline-block;
}

/* ── Divider ── */
.al-divider {
  height: 1px; background: #f3f4f6; margin: 24px 0;
}

/* ── Field ── */
.al-field { margin-bottom: 20px; }
.al-field:last-of-type { margin-bottom: 0; }
.al-label {
  display: block; font-size: 12px; font-weight: 700; color: #6b7280;
  margin-bottom: 8px; letter-spacing: 0.06em; text-transform: uppercase;
}
.al-label-opt { color: #d1d5db; font-weight: 400; text-transform: none; letter-spacing: 0; }

.al-input, .al-textarea {
  width: 100%; background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 12px; padding: 13px 16px; font-size: 15px; color: #1e1b4b;
  outline: none; font-family: inherit; font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s; box-sizing: border-box;
}
.al-input::placeholder, .al-textarea::placeholder { color: #d1d5db; font-weight: 400; }
.al-input:focus, .al-textarea:focus {
  border-color: #6366f1; background: #fff; box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
}
.al-input.error { border-color: #fca5a5; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }
.al-error-text { font-size: 12px; color: #ef4444; font-weight: 600; margin-top: 5px; }
.al-textarea { resize: vertical; min-height: 100px; }

.al-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* ── Duration pill ── */
.al-duration-pill {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #eef2ff, #ede9fe);
  border: 1px solid #c7d2fe; border-radius: 14px;
  padding: 14px 20px; margin-bottom: 20px;
  animation: alFade 0.25s ease both;
}
.al-duration-left { display: flex; align-items: center; gap: 10px; }
.al-duration-icon { font-size: 20px; }
.al-duration-label { font-size: 13px; font-weight: 600; color: #4338ca; }
.al-duration-val   { font-size: 24px; font-weight: 800; color: #4338ca; letter-spacing: -0.02em; }
.al-duration-sub   { font-size: 12px; color: #818cf8; margin-top: 1px; }

/* Weekend warning */
.al-weekend-warn {
  display: flex; align-items: center; gap: 8px;
  background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;
  font-size: 13px; font-weight: 600; color: #92400e;
  animation: alFade 0.2s ease both;
}

/* ── Submit ── */
.al-submit-row { display: flex; gap: 12px; margin-top: 8px; }
.al-submit-btn {
  flex: 1; padding: 15px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1); color: #fff;
  font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 16px rgba(99,102,241,0.32);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.al-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.42); }
.al-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.al-reset-btn {
  padding: 15px 20px; border-radius: 12px;
  border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.18s;
}
.al-reset-btn:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }

/* ── Right sidebar ── */
.al-right { display: flex; flex-direction: column; gap: 20px; }

/* Balance card */
.al-balance-card {
  background: #fff; border-radius: 20px; padding: 26px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: alFade 0.46s ease both;
}
.al-balance-title { font-size: 14px; font-weight: 800; color: #1e1b4b; margin-bottom: 18px; display: flex; align-items: center; gap: 7px; }
.al-balance-item {
  display: flex; flex-direction: column; gap: 6px;
  padding: 14px 0; border-bottom: 1px solid #f3f4f6;
}
.al-balance-item:last-child { border-bottom: none; padding-bottom: 0; }
.al-balance-row { display: flex; align-items: center; justify-content: space-between; }
.al-balance-type { font-size: 13px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 7px; }
.al-balance-nums { font-size: 13px; font-weight: 700; color: #6b7280; }
.al-balance-nums strong { color: "#4338ca"; }
.al-bal-bar { height: 5px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
.al-bal-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
.al-balance-empty { text-align: center; color: #9ca3af; font-size: 13px; padding: 16px 0; }

/* Tips card */
.al-tips-card {
  background: linear-gradient(160deg, #4338ca 0%, #6366f1 100%);
  border-radius: 20px; padding: 26px;
  animation: alFade 0.48s ease both;
  position: relative; overflow: hidden;
}
.al-tips-card::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,0.07); pointer-events: none;
}
.al-tips-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 7px; }
.al-tip-item {
  display: flex; align-items: flex-start; gap: 10px;
  margin-bottom: 12px;
}
.al-tip-item:last-child { margin-bottom: 0; }
.al-tip-dot {
  width: 20px; height: 20px; border-radius: 6px;
  background: rgba(255,255,255,0.18); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
  margin-top: 1px;
}
.al-tip-text { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8); line-height: 1.5; }

/* Policy card */
.al-policy-card {
  background: #fff; border-radius: 20px; padding: 22px 26px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  animation: alFade 0.5s ease both;
}
.al-policy-title { font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.al-policy-item  { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f9fafb; font-size: 13px; }
.al-policy-item:last-child { border-bottom: none; }
.al-policy-key   { color: #6b7280; font-weight: 500; }
.al-policy-val   { font-weight: 700; color: #1e1b4b; }

/* ── Toast ── */
.al-toast {
  position: fixed; bottom: 28px; right: 28px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 600; padding: 14px 22px;
  border-radius: 12px; box-shadow: 0 8px 32px rgba(30,27,75,0.2);
  display: flex; align-items: center; gap: 10px;
  z-index: 9999; animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1); color: #fff;
}
.al-toast.success { background: #064e3b; }
.al-toast.error   { background: #7f1d1d; }
.al-toast.warn    { background: #78350f; }

@keyframes alFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

const LEAVE_TYPES = [
  { value: "SICK",   label: "Sick Leave",   icon: "🤒", sub: "Medical / illness",    color: "#f59e0b" },
  { value: "CASUAL", label: "Casual Leave", icon: "🌴", sub: "Personal / errands",   color: "#6366f1" },
  { value: "PAID",   label: "Paid Leave",   icon: "💼", sub: "Annual paid time off",  color: "#10b981" },
  { value: "UNPAID", label: "Unpaid Leave", icon: "📋", sub: "Without pay deduction", color: "#9ca3af" },
];

const TIPS = [
  "Apply at least 2 days before your leave starts",
  "Emergency leaves can be applied on the same day",
  "Ensure your leave balance is sufficient before applying",
  "You can cancel pending requests from Leave History",
];

const POLICY = [
  { key: "Sick Leave / year",   val: "12 days" },
  { key: "Casual Leave / year", val: "12 days" },
  { key: "Paid Leave / year",   val: "15 days" },
  { key: "Notice required",     val: "2 days" },
];

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [reason, setReason]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [balances, setBalances]   = useState([]);
  const [errors, setErrors]       = useState({});
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchBalances = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res    = await API.get(`/leaves/balance/${userId}`);
      setBalances(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchBalances(); }, [fetchBalances]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end   = new Date(endDate);
    if (end < start) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const countWeekends = () => {
    if (!startDate || !endDate) return 0;
    let count = 0;
    const cur = new Date(startDate);
    const end = new Date(endDate);
    while (cur <= end) {
      if (cur.getDay() === 0 || cur.getDay() === 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const getBalance = (type) => balances.find(b => b.leaveType === type);
  const selectedBalance = leaveType ? getBalance(leaveType) : null;

  const validate = () => {
    const errs = {};
    if (!leaveType)  errs.leaveType = "Please select a leave type";
    if (!startDate)  errs.startDate = "Start date is required";
    if (!endDate)    errs.endDate   = "End date is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      errs.endDate = "End date must be after start date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setLeaveType(""); setStartDate(""); setEndDate(""); setReason(""); setErrors({});
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await API.post("/leaves/apply", { leaveType, startDate, endDate, reason });
      showToast("✅ Leave request submitted successfully!", "success");
      resetForm();
      fetchBalances();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || "Error applying leave";
      showToast(`❌ ${message}`, "error");
    }
    setLoading(false);
  };

  const days     = calculateDays();
  const weekends = countWeekends();
  const today    = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const getBarColor = (remaining, total) => {
    if (!total) return "#e5e7eb";
    const pct = (remaining / total) * 100;
    return pct > 50 ? "#10b981" : pct > 20 ? "#f59e0b" : "#ef4444";
  };

  return (
    <>
      <style>{css}</style>
      <div className="al-root">
        <Navbar />
        <div className="al-body">

          {/* Header */}
          <div className="al-page-header">
            <div>
              <div className="al-page-title">Apply for Leave</div>
              <div className="al-page-sub">Submit a new leave request for manager approval</div>
            </div>
            <div className="al-page-date">📅 {today}</div>
          </div>

          <div className="al-grid">

            {/* ── LEFT: Main form ── */}
            <div className="al-card">
              <div className="al-card-title">📝 Leave Request Form</div>

              <form onSubmit={applyLeave}>

                {/* Leave type picker */}
                <div className="al-field">
                  <label className="al-label">Leave Type *</label>
                  <div className="al-type-grid">
                    {LEAVE_TYPES.map((t) => {
                      const bal = getBalance(t.value);
                      return (
                        <div
                          key={t.value}
                          className={`al-type-card ${leaveType === t.value ? "selected" : ""}`}
                          onClick={() => { setLeaveType(t.value); setErrors(p => ({ ...p, leaveType: "" })); }}
                        >
                          <div className="al-type-icon-wrap">{t.icon}</div>
                          <div>
                            <div className="al-type-label">{t.label}</div>
                            <div className="al-type-sub">{t.sub}</div>
                            {bal && (
                              <div className="al-type-bal">
                                {bal.remainingLeave} days left
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.leaveType && <div className="al-error-text">⚠ {errors.leaveType}</div>}
                </div>

                <div className="al-divider" />

                {/* Date range */}
                <div className="al-grid2">
                  <div className="al-field">
                    <label className="al-label">Start Date *</label>
                    <input
                      className={`al-input ${errors.startDate ? "error" : ""}`}
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => { setStartDate(e.target.value); setErrors(p => ({ ...p, startDate: "" })); }}
                    />
                    {errors.startDate && <div className="al-error-text">⚠ {errors.startDate}</div>}
                  </div>
                  <div className="al-field">
                    <label className="al-label">End Date *</label>
                    <input
                      className={`al-input ${errors.endDate ? "error" : ""}`}
                      type="date"
                      value={endDate}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => { setEndDate(e.target.value); setErrors(p => ({ ...p, endDate: "" })); }}
                    />
                    {errors.endDate && <div className="al-error-text">⚠ {errors.endDate}</div>}
                  </div>
                </div>

                {/* Duration pill */}
                {days > 0 && (
                  <div className="al-duration-pill">
                    <div className="al-duration-left">
                      <span className="al-duration-icon">📅</span>
                      <div>
                        <div className="al-duration-label">Total Duration</div>
                        <div className="al-duration-sub">
                          {startDate} → {endDate}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="al-duration-val">{days}</div>
                      <div className="al-duration-sub">{days === 1 ? "day" : "days"}</div>
                    </div>
                  </div>
                )}

                {/* Weekend warning */}
                {weekends > 0 && days > 0 && (
                  <div className="al-weekend-warn">
                    ⚠️ Your selection includes <strong style={{ margin: "0 3px" }}>{weekends}</strong> weekend {weekends === 1 ? "day" : "days"} — these may not be counted
                  </div>
                )}

                {/* Reason */}
                <div className="al-field">
                  <label className="al-label">
                    Reason <span className="al-label-opt">(optional)</span>
                  </label>
                  <textarea
                    className="al-textarea"
                    placeholder="Briefly describe the reason for your leave request…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="al-submit-row">
                  <button
                    type="submit"
                    className="al-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting…" : "Submit Request →"}
                  </button>
                  <button type="button" className="al-reset-btn" onClick={resetForm}>
                    Reset
                  </button>
                </div>

              </form>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="al-right">

              {/* Leave balance */}
              <div className="al-balance-card">
                <div className="al-balance-title">💰 Your Leave Balance</div>
                {balances.length === 0 ? (
                  <div className="al-balance-empty">No balance data</div>
                ) : balances.map((b) => {
                  const pct      = b.totalLeave > 0 ? Math.round((b.remainingLeave / b.totalLeave) * 100) : 0;
                  const barColor = getBarColor(b.remainingLeave, b.totalLeave);
                  const typeInfo = LEAVE_TYPES.find(t => t.value === b.leaveType);
                  return (
                    <div key={b.id} className="al-balance-item">
                      <div className="al-balance-row">
                        <div className="al-balance-type">
                          <span>{typeInfo?.icon || "📋"}</span>
                          {b.leaveType}
                        </div>
                        <div className="al-balance-nums">
                          <span style={{ fontWeight: 800, color: barColor }}>{b.remainingLeave}</span>
                          <span style={{ color: "#d1d5db" }}> / {b.totalLeave}</span>
                        </div>
                      </div>
                      <div className="al-bal-bar">
                        <div className="al-bal-fill" style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${barColor}99, ${barColor})`
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips */}
              <div className="al-tips-card">
                <div className="al-tips-title">💡 Tips</div>
                {TIPS.map((tip, i) => (
                  <div key={i} className="al-tip-item">
                    <div className="al-tip-dot">{i + 1}</div>
                    <div className="al-tip-text">{tip}</div>
                  </div>
                ))}
              </div>

              {/* Policy */}
              <div className="al-policy-card">
                <div className="al-policy-title">📜 Leave Policy</div>
                {POLICY.map((p, i) => (
                  <div key={i} className="al-policy-item">
                    <span className="al-policy-key">{p.key}</span>
                    <span className="al-policy-val">{p.val}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {toast && <div className={`al-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

export default ApplyLeave;