import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mlb-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.mlb-body {
  padding: 36px 40px 64px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Page header ── */
.mlb-page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  margin-bottom: 32px;
  animation: mlbFadeUp 0.38s ease both;
}
.mlb-page-title { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 3px; }
.mlb-page-sub   { font-size: 14px; color: #9ca3af; font-weight: 500; }
.mlb-header-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: #fff; border: 1px solid rgba(99,102,241,0.15);
  border-radius: 100px; padding: 7px 16px;
  font-size: 13px; font-weight: 700; color: #4338ca;
  box-shadow: 0 2px 8px rgba(99,102,241,0.08);
}

/* ── Summary stats ── */
.mlb-summary {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 28px;
  animation: mlbFadeUp 0.4s ease both;
}
.mlb-summary-card {
  background: #fff; border-radius: 16px; padding: 20px 22px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  display: flex; align-items: center; gap: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.mlb-summary-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
.mlb-summary-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.mlb-summary-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
.mlb-summary-value { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; line-height: 1; }

/* ── Main grid: 460px left, rest right ── */
.mlb-grid {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 24px;
  align-items: start;
}

/* ── Card ── */
.mlb-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  padding: 32px;
  animation: mlbFadeUp 0.44s ease both;
}
.mlb-card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
}
.mlb-card-title { font-size: 16px; font-weight: 800; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }

/* ── Step sections inside the left card ── */
.mlb-step {
  margin-bottom: 28px; padding-bottom: 28px;
  border-bottom: 1px solid #f3f4f6;
}
.mlb-step:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.mlb-step-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 800; color: #4338ca;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 14px;
}
.mlb-step-num {
  width: 22px; height: 22px; border-radius: 6px;
  background: #ede9fe; color: #4338ca;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
}

/* ── Mode pills ── */
.mlb-mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mlb-mode-pill {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700; padding: 13px 16px;
  border-radius: 12px; border: 1.5px solid #e5e7eb;
  background: #f8f9ff; color: #6b7280; cursor: pointer;
  transition: all 0.18s; user-select: none;
}
.mlb-mode-pill.active {
  background: #eef2ff; border-color: #a5b4fc; color: #4338ca;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}
.mlb-mode-pill:hover:not(.active) { border-color: #c7d2fe; color: #4338ca; background: #f0f4ff; }
.mlb-mode-pill input[type="radio"] { display: none; }
.mlb-mode-icon { font-size: 18px; }

/* ── Employee list ── */
.mlb-emp-search {
  position: relative; margin-bottom: 10px;
}
.mlb-emp-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; opacity: 0.4; pointer-events: none; }
.mlb-emp-search input {
  width: 100%; background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 10px; padding: 10px 14px 10px 36px;
  font-size: 13px; color: #1e1b4b; font-family: inherit;
  font-weight: 500; outline: none; box-sizing: border-box;
  transition: border 0.2s, box-shadow 0.2s;
}
.mlb-emp-search input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

.mlb-select-all-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 4px; margin-bottom: 6px;
  font-size: 12px; font-weight: 700; color: #6366f1; cursor: pointer; user-select: none;
}
.mlb-select-all-row:hover { color: #4338ca; }
.mlb-selected-count {
  font-size: 11px; font-weight: 700; color: #6d28d9;
  background: #ede9fe; padding: 2px 8px; border-radius: 100px;
}

.mlb-emp-list {
  max-height: 260px; overflow-y: auto;
  border: 1.5px solid #e5e7eb; border-radius: 14px;
  background: #fafbff; padding: 6px;
}
.mlb-emp-list::-webkit-scrollbar { width: 5px; }
.mlb-emp-list::-webkit-scrollbar-track { background: transparent; }
.mlb-emp-list::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 10px; }

.mlb-emp-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  cursor: pointer; transition: background 0.14s; user-select: none;
}
.mlb-emp-item:hover { background: #eef2ff; }
.mlb-emp-item.checked { background: #eef2ff; }

.mlb-emp-checkbox {
  width: 18px; height: 18px; border-radius: 5px;
  border: 1.5px solid #c7d2fe; background: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.15s;
}
.mlb-emp-checkbox.checked { background: #6366f1; border-color: #6366f1; }

.mlb-emp-mini-avatar {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg, #4338ca, #818cf8);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.mlb-emp-item-name { font-size: 13px; font-weight: 700; color: #1e1b4b; }
.mlb-emp-item-dept { font-size: 11px; color: #9ca3af; margin-top: 1px; }

/* ── Form fields ── */
.mlb-field { margin-bottom: 0; }
.mlb-label {
  display: block; font-size: 11px; font-weight: 700;
  color: #6b7280; text-transform: uppercase;
  letter-spacing: 0.07em; margin-bottom: 8px;
}
.mlb-form-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mlb-select, .mlb-input {
  width: 100%; background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #1e1b4b;
  font-family: inherit; font-weight: 500; outline: none;
  transition: border 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.mlb-select:focus, .mlb-input:focus {
  border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: #fff;
}
.mlb-select {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  background-color: #f8f9ff; padding-right: 36px;
}
.mlb-input[type="number"] { -moz-appearance: textfield; }
.mlb-input[type="number"]::-webkit-outer-spin-button,
.mlb-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

/* ── Action type cards ── */
.mlb-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mlb-action-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 16px 12px; border-radius: 12px;
  border: 1.5px solid #e5e7eb; background: #f8f9ff;
  cursor: pointer; transition: all 0.18s; user-select: none;
}
.mlb-action-card.active { background: #eef2ff; border-color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
.mlb-action-card:hover:not(.active) { border-color: #c7d2fe; background: #f0f4ff; }
.mlb-action-card input[type="radio"] { display: none; }
.mlb-action-icon { font-size: 22px; }
.mlb-action-name { font-size: 13px; font-weight: 700; color: #374151; }
.mlb-action-desc { font-size: 11px; color: #9ca3af; text-align: center; }
.mlb-action-card.active .mlb-action-name { color: #4338ca; }

/* ── Bottom action buttons ── */
.mlb-btn-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 28px; }
.mlb-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; padding: 14px 22px;
  border-radius: 12px; border: none; cursor: pointer;
  transition: all 0.18s; white-space: nowrap;
}
.mlb-btn.apply {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; box-shadow: 0 4px 16px rgba(99,102,241,0.3);
}
.mlb-btn.apply:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.42); }
.mlb-btn.apply:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.mlb-btn.danger {
  background: #fef2f2; color: #dc2626;
  border: 1.5px solid #fecaca; padding: 14px 20px;
}
.mlb-btn.danger:hover:not(:disabled) { background: #dc2626; color: #fff; box-shadow: 0 4px 14px rgba(220,38,38,0.3); }
.mlb-btn.danger:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Right column ── */
.mlb-right { display: flex; flex-direction: column; gap: 0; }

/* ── Table controls ── */
.mlb-table-controls {
  display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
  margin-bottom: 20px;
}
.mlb-search-wrap { position: relative; flex: 1; min-width: 200px; }
.mlb-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; opacity: 0.4; pointer-events: none; }
.mlb-search {
  width: 100%; background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 12px; padding: 11px 16px 11px 42px;
  font-size: 14px; color: #1e1b4b; font-family: inherit;
  font-weight: 500; outline: none;
  transition: border 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.mlb-search:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: #fff; }

.mlb-filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
.mlb-filter-pill {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700; padding: 6px 14px;
  border-radius: 100px; border: 1.5px solid #e5e7eb;
  background: #fff; color: #6b7280; cursor: pointer; transition: all 0.16s;
}
.mlb-filter-pill.active { background: #eef2ff; border-color: #a5b4fc; color: #4338ca; }
.mlb-filter-pill:hover:not(.active) { background: #f0f4ff; border-color: #c7d2fe; }

/* ── Table ── */
.mlb-table-wrap { overflow-x: auto; }
.mlb-table { width: 100%; border-collapse: collapse; min-width: 560px; }
.mlb-table thead tr { border-bottom: 1px solid #f3f4f6; }
.mlb-table thead th {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #9ca3af; padding: 10px 14px; text-align: left;
  white-space: nowrap;
}
.mlb-table tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
.mlb-table tbody tr:last-child { border-bottom: none; }
.mlb-table tbody tr:hover { background: #fafbff; }
.mlb-table td { padding: 14px 14px; font-size: 14px; color: #374151; font-weight: 500; }

.mlb-emp-badge { display: inline-flex; align-items: center; gap: 10px; }
.mlb-emp-avatar {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #4338ca, #818cf8);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.mlb-emp-avatar-name { font-weight: 700; color: #1e1b4b; font-size: 14px; }
.mlb-emp-avatar-id   { font-size: 11px; color: #9ca3af; margin-top: 1px; }

.mlb-type-pill {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px; letter-spacing: 0.04em;
}
.mlb-type-CASUAL { background: #ede9fe; color: #6d28d9; }
.mlb-type-SICK   { background: #fef3c7; color: #92400e; }
.mlb-type-PAID   { background: #d1fae5; color: #065f46; }

.mlb-bar-wrap { display: flex; align-items: center; gap: 8px; min-width: 140px; }
.mlb-bar-bg { flex: 1; height: 6px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
.mlb-bar-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
.mlb-bar-pct { font-size: 11px; font-weight: 700; min-width: 34px; text-align: right; }

.mlb-remaining-chip {
  display: inline-block; font-size: 14px; font-weight: 800;
  color: #4338ca; background: #eef2ff;
  padding: 4px 12px; border-radius: 8px;
}

.mlb-empty { text-align: center; color: #9ca3af; padding: 44px; font-size: 14px; }

/* ── Toast ── */
.mlb-toast {
  position: fixed; bottom: 28px; right: 28px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  padding: 14px 22px; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(30,27,75,0.2);
  display: flex; align-items: center; gap: 10px;
  z-index: 9999; animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1); color: #fff;
}
.mlb-toast.success { background: #064e3b; }
.mlb-toast.error   { background: #7f1d1d; }
.mlb-toast.warn    { background: #78350f; }

@keyframes mlbFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

const LEAVE_TYPES   = ["CASUAL", "SICK", "PAID"];
const FILTER_ALL    = "ALL";

const ACTIONS = [
  { value: "ADD", icon: "➕", name: "Add Days",  desc: "Add to current balance" },
  { value: "SET", icon: "🔁", name: "Set Days",  desc: "Override existing balance" },
];

function ManageLeaveBalance() {
  const [employees, setEmployees]     = useState([]);
  const [mode, setMode]               = useState("ALL");
  const [selected, setSelected]       = useState([]);
  const [empSearch, setEmpSearch]     = useState("");
  const [leaveType, setLeaveType]     = useState("CASUAL");
  const [action, setAction]           = useState("ADD");
  const [value, setValue]             = useState("");
  const [balances, setBalances]       = useState([]);
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState(FILTER_ALL);
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);

  useEffect(() => { fetchEmployees(); fetchBalances(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/admin/users");
      setEmployees(res.data.filter(u => u.role === "EMPLOYEE"));
    } catch (err) { console.error(err); }
  };

  const fetchBalances = async () => {
    try {
      const res = await API.get("/leaves/balance/all");
      setBalances(res.data);
    } catch (err) { console.error(err); }
  };

  const toggleEmployee = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const visible = filteredEmps.map(e => e.id);
    const allSelected = visible.every(id => selected.includes(id));
    setSelected(prev => allSelected ? prev.filter(id => !visible.includes(id)) : [...new Set([...prev, ...visible])]);
  };

  const applyChanges = async () => {
    if (!value || Number(value) <= 0) { showToast("⚠️ Enter a valid number greater than 0", "warn"); return; }
    if (mode === "SELECTED" && selected.length === 0) { showToast("⚠️ Select at least one employee", "warn"); return; }
    setLoading(true);
    try {
      await API.post("/leaves/balance/bulk-update", {
        mode, employeeIds: selected, leaveType, action, value: Number(value)
      });
      showToast(`✅ Balance ${action === "ADD" ? "added" : "set"} successfully`, "success");
      setSelected([]); setValue(""); fetchBalances();
    } catch (err) { console.error(err); showToast("❌ Error updating balance", "error"); }
    setLoading(false);
  };

  const deleteBalance = async () => {
    if (mode !== "SELECTED" || selected.length === 0) { showToast("⚠️ Switch to 'Selected' and pick employees first", "warn"); return; }
    setLoading(true);
    try {
      for (let empId of selected) {
        await API.delete(`/leaves/balance/delete?employeeId=${empId}&leaveType=${leaveType}`);
      }
      showToast("🗑️ Balance removed successfully", "success");
      setSelected([]); fetchBalances();
    } catch (err) { console.error(err); showToast("❌ Error removing balance", "error"); }
    setLoading(false);
  };

  const getInitials = (name = "") => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  const getBarColor = (pct) => pct >= 80 ? "#ef4444" : pct >= 50 ? "#f59e0b" : "#6366f1";

  const filteredEmps = employees.filter(e =>
    !empSearch || e.name?.toLowerCase().includes(empSearch.toLowerCase()) || String(e.id).includes(empSearch)
  );

  const filteredBalances = balances.filter(b => {
    const matchSearch = !search ||
      b.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.employeeId).includes(search);
    const matchType = filterType === FILTER_ALL || b.leaveType === filterType;
    return matchSearch && matchType;
  });

  const allVisibleSelected = filteredEmps.length > 0 && filteredEmps.every(e => selected.includes(e.id));

  // Summary stats
  const totalEmp      = employees.length;
  const totalRecords  = balances.length;
  const avgRemaining  = balances.length > 0 ? Math.round(balances.reduce((s, b) => s + b.remainingLeave, 0) / balances.length) : 0;
  const highUsage     = balances.filter(b => b.totalLeave > 0 && (b.usedLeave / b.totalLeave) >= 0.8).length;

  return (
    <>
      <style>{css}</style>
      <div className="mlb-root">
        <Navbar />
        <div className="mlb-body">

          {/* Header */}
          <div className="mlb-page-header">
            <div>
              <div className="mlb-page-title">Leave Balance Management</div>
              <div className="mlb-page-sub">Assign, update, or remove leave balances for your entire team</div>
            </div>
            <div className="mlb-header-badge">
              📋 {totalRecords} balance records
            </div>
          </div>

          {/* Summary */}
          <div className="mlb-summary">
            {[
              { label: "Total Employees", value: totalEmp,      icon: "👥", bg: "#eff6ff",  color: "#1d4ed8" },
              { label: "Balance Records", value: totalRecords,  icon: "📋", bg: "#f5f3ff",  color: "#6d28d9" },
              { label: "Avg Remaining",   value: avgRemaining,  icon: "📊", bg: "#f0fdf4",  color: "#065f46" },
              { label: "High Usage (≥80%)",value: highUsage,    icon: "⚠️", bg: "#fef2f2",  color: "#991b1b" },
            ].map((s, i) => (
              <div className="mlb-summary-card" key={i}>
                <div className="mlb-summary-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="mlb-summary-label">{s.label}</div>
                  <div className="mlb-summary-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="mlb-grid">

            {/* ── LEFT: Control panel ── */}
            <div className="mlb-card">
              <div className="mlb-card-header">
                <div className="mlb-card-title">⚙️ Configure Update</div>
              </div>

              {/* Step 1: Apply To */}
              <div className="mlb-step">
                <div className="mlb-step-label">
                  <div className="mlb-step-num">1</div>
                  Apply To
                </div>
                <div className="mlb-mode-row">
                  <label className={`mlb-mode-pill ${mode === "ALL" ? "active" : ""}`}>
                    <input type="radio" value="ALL" checked={mode === "ALL"} onChange={() => { setMode("ALL"); setSelected([]); }} />
                    <span className="mlb-mode-icon">👥</span>
                    <span>All Employees</span>
                  </label>
                  <label className={`mlb-mode-pill ${mode === "SELECTED" ? "active" : ""}`}>
                    <input type="radio" value="SELECTED" checked={mode === "SELECTED"} onChange={() => setMode("SELECTED")} />
                    <span className="mlb-mode-icon">☑️</span>
                    <span>Selected Only</span>
                  </label>
                </div>
              </div>

              {/* Step 1b: Employee picker (SELECTED mode) */}
              {mode === "SELECTED" && (
                <div className="mlb-step">
                  <div className="mlb-step-label">
                    <div className="mlb-step-num">↳</div>
                    Pick Employees
                    {selected.length > 0 && <span className="mlb-selected-count">{selected.length} selected</span>}
                  </div>

                  <div className="mlb-emp-search">
                    <span className="mlb-emp-search-icon">🔍</span>
                    <input
                      placeholder="Search employees…"
                      value={empSearch}
                      onChange={e => setEmpSearch(e.target.value)}
                    />
                  </div>

                  <div className="mlb-select-all-row" onClick={toggleSelectAll}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className={`mlb-emp-checkbox ${allVisibleSelected ? "checked" : ""}`}>
                        {allVisibleSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      Select all visible
                    </div>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{filteredEmps.length} shown</span>
                  </div>

                  <div className="mlb-emp-list">
                    {filteredEmps.length === 0 ? (
                      <div className="mlb-empty" style={{ padding: 20 }}>No employees found</div>
                    ) : filteredEmps.map(emp => (
                      <div
                        key={emp.id}
                        className={`mlb-emp-item ${selected.includes(emp.id) ? "checked" : ""}`}
                        onClick={() => toggleEmployee(emp.id)}
                      >
                        <div className={`mlb-emp-checkbox ${selected.includes(emp.id) ? "checked" : ""}`}>
                          {selected.includes(emp.id) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="mlb-emp-mini-avatar">{getInitials(emp.name)}</div>
                        <div>
                          <div className="mlb-emp-item-name">{emp.name}</div>
                          <div className="mlb-emp-item-dept">{emp.department || `ID: ${emp.id}`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Leave type + Action */}
              <div className="mlb-step">
                <div className="mlb-step-label">
                  <div className="mlb-step-num">2</div>
                  Leave Type & Action
                </div>

                <div className="mlb-field" style={{ marginBottom: 16 }}>
                  <label className="mlb-label">Leave Type</label>
                  <select className="mlb-select" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                    {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="mlb-action-grid">
                  {ACTIONS.map(a => (
                    <label key={a.value} className={`mlb-action-card ${action === a.value ? "active" : ""}`}>
                      <input type="radio" value={a.value} checked={action === a.value} onChange={() => setAction(a.value)} />
                      <span className="mlb-action-icon">{a.icon}</span>
                      <span className="mlb-action-name">{a.name}</span>
                      <span className="mlb-action-desc">{a.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Days */}
              <div className="mlb-step">
                <div className="mlb-step-label">
                  <div className="mlb-step-num">3</div>
                  Number of Days
                </div>
                <input
                  type="number"
                  min="1"
                  className="mlb-input"
                  placeholder="e.g.  12"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="mlb-btn-row">
                <button className="mlb-btn apply" onClick={applyChanges} disabled={loading}>
                  {loading ? "Applying…" : "✓ Apply Changes"}
                </button>
                <button
                  className="mlb-btn danger"
                  onClick={deleteBalance}
                  disabled={loading || mode !== "SELECTED" || selected.length === 0}
                  title={mode !== "SELECTED" ? "Switch to 'Selected' mode first" : ""}
                >
                  🗑
                </button>
              </div>
            </div>

            {/* ── RIGHT: Balance table ── */}
            <div className="mlb-right">
              <div className="mlb-card" style={{ padding: "28px 28px" }}>
                <div className="mlb-card-header" style={{ marginBottom: 20 }}>
                  <div className="mlb-card-title">
                    📊 Employee Leave Balances
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#6366f1",
                    background: "#ede9fe", padding: "3px 10px", borderRadius: 100
                  }}>
                    {filteredBalances.length} records
                  </span>
                </div>

                {/* Controls */}
                <div className="mlb-table-controls">
                  <div className="mlb-search-wrap">
                    <span className="mlb-search-icon">🔍</span>
                    <input
                      className="mlb-search"
                      placeholder="Search by name or ID…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="mlb-filter-row">
                    {[FILTER_ALL, ...LEAVE_TYPES].map(t => (
                      <button
                        key={t}
                        className={`mlb-filter-pill ${filterType === t ? "active" : ""}`}
                        onClick={() => setFilterType(t)}
                      >
                        {t === FILTER_ALL ? "All" : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="mlb-table-wrap">
                  <table className="mlb-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Used</th>
                        <th>Remaining</th>
                        <th>Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBalances.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="mlb-empty">
                            {search ? "🔍 No records match your search" : "No balance data available"}
                          </td>
                        </tr>
                      ) : filteredBalances.map((b, i) => {
                        const pct      = b.totalLeave > 0 ? Math.round((b.usedLeave / b.totalLeave) * 100) : 0;
                        const barColor = getBarColor(pct);
                        return (
                          <tr key={i}>
                            <td>
                              <div className="mlb-emp-badge">
                                <div className="mlb-emp-avatar">{getInitials(b.employeeName)}</div>
                                <div>
                                  <div className="mlb-emp-avatar-name">{b.employeeName}</div>
                                  <div className="mlb-emp-avatar-id">ID: {b.employeeId}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`mlb-type-pill mlb-type-${b.leaveType}`}>{b.leaveType}</span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{b.totalLeave}</td>
                            <td style={{ fontWeight: 600 }}>{b.usedLeave}</td>
                            <td>
                              <span className="mlb-remaining-chip">{b.remainingLeave}</span>
                            </td>
                            <td>
                              <div className="mlb-bar-wrap">
                                <div className="mlb-bar-bg">
                                  <div className="mlb-bar-fill" style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${barColor}bb, ${barColor})`
                                  }} />
                                </div>
                                <span className="mlb-bar-pct" style={{ color: barColor }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {toast && <div className={`mlb-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

export default ManageLeaveBalance;