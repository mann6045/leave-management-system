import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pf-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.pf-body {
  padding: 36px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.pf-page-header { margin-bottom: 32px; animation: pfFadeUp 0.4s ease both; }
.pf-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.pf-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

.pf-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;
}

/* ── Left avatar card ── */
.pf-avatar-card {
  background: #fff; border-radius: 20px; padding: 32px 24px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  display: flex; flex-direction: column; align-items: center;
  animation: pfFadeUp 0.42s ease both; text-align: center;
}
.pf-avatar-wrap { position: relative; margin-bottom: 18px; }
.pf-avatar {
  width: 96px; height: 96px; border-radius: 28px;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 38px; font-weight: 800; color: #fff;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
}
.pf-avatar img {
  width: 96px; height: 96px; border-radius: 28px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  display: block;
}
.pf-avatar-ring {
  position: absolute; inset: -4px; border-radius: 32px;
  border: 2px solid rgba(99,102,241,0.2);
}
.pf-avatar-online {
  position: absolute; bottom: -2px; right: -2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #22c55e; border: 3px solid #fff;
}
.pf-avatar-name {
  font-size: 18px; font-weight: 800; color: #1e1b4b;
  letter-spacing: -0.02em; margin-bottom: 6px;
}
.pf-avatar-role {
  font-size: 12px; font-weight: 700; padding: 4px 14px;
  border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 20px;
}
.pf-avatar-role.ADMIN    { background: #f5f3ff; color: #6d28d9; }
.pf-avatar-role.MANAGER  { background: #f0fdf4; color: #065f46; }
.pf-avatar-role.EMPLOYEE { background: #eff6ff; color: #1d4ed8; }

.pf-info-chips { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.pf-info-chip {
  display: flex; align-items: center; gap: 10px;
  background: #f8f9ff; border-radius: 10px; padding: 10px 14px;
  border: 1px solid #eef0fa;
}
.pf-chip-icon { font-size: 16px; flex-shrink: 0; }
.pf-chip-body { text-align: left; }
.pf-chip-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; }
.pf-chip-value { font-size: 13px; font-weight: 600; color: #374151; margin-top: 1px; }

.pf-change-photo {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700; color: #6b7280;
  background: #f3f4f6; border: 1.5px solid #e5e7eb;
  padding: 8px 16px; border-radius: 8px; cursor: pointer;
  transition: all 0.18s; width: 100%;
}
.pf-change-photo:hover { background: #ede9fe; color: #4338ca; border-color: #c7d2fe; }

/* ── Right column ── */
.pf-right { display: flex; flex-direction: column; gap: 20px; }

.pf-tabs {
  display: flex; gap: 4px;
  background: #fff; border-radius: 12px; padding: 6px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  animation: pfFadeUp 0.43s ease both; width: fit-content;
}
.pf-tab {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 8px 18px; border-radius: 8px; border: none;
  background: none; color: #6b7280; cursor: pointer; transition: all 0.18s;
}
.pf-tab:hover { background: #f0f4ff; color: #4338ca; }
.pf-tab.active {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.pf-form-card {
  background: #fff; border-radius: 20px; padding: 32px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: pfFadeUp 0.45s ease both;
}
.pf-form-section-title {
  font-size: 15px; font-weight: 700; color: #1e1b4b;
  margin-bottom: 22px; display: flex; align-items: center; gap: 8px;
}
.pf-form-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.pf-field { margin-bottom: 18px; }
.pf-field:last-child { margin-bottom: 0; }
.pf-label {
  display: block; font-size: 12px; font-weight: 700; color: #6b7280;
  margin-bottom: 8px; letter-spacing: 0.06em; text-transform: uppercase;
}
.pf-input, .pf-textarea, .pf-select {
  width: 100%; background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #1e1b4b;
  outline: none; font-family: inherit; font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s; box-sizing: border-box;
}
.pf-input::placeholder, .pf-textarea::placeholder { color: #d1d5db; font-weight: 400; }
.pf-input:focus, .pf-textarea:focus, .pf-select:focus {
  border-color: #6366f1; background: #fff; box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
}
.pf-input:disabled {
  background: #f3f4f6; color: #9ca3af; cursor: not-allowed; border-color: #e5e7eb;
}
.pf-textarea { resize: vertical; min-height: 90px; }
.pf-select {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center; background-color: #f8f9ff;
}
.pf-locked-hint {
  font-size: 11px; color: #9ca3af; font-weight: 500;
  margin-top: 5px; display: flex; align-items: center; gap: 4px;
}
.pf-save-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 28px; padding-top: 20px; border-top: 1px solid #f3f4f6;
  flex-wrap: wrap; gap: 12px;
}
.pf-save-hint { font-size: 13px; color: #9ca3af; font-weight: 500; }
.pf-save-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; padding: 12px 28px;
  border-radius: 12px; border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1); color: #fff; cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.32);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.pf-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.42); }
.pf-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Stats row */
.pf-stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  animation: pfFadeUp 0.46s ease both;
}
.pf-stat-card {
  background: #fff; border-radius: 16px; padding: 20px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  display: flex; align-items: flex-start; gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pf-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
.pf-stat-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; flex-shrink: 0;
}
.pf-stat-label {
  font-size: 11px; font-weight: 700; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px;
}
.pf-stat-value {
  font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; line-height: 1;
}

/* Security tab */
.pf-pwd-card {
  background: #fff; border-radius: 20px; padding: 32px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: pfFadeUp 0.45s ease both;
}
.pf-pwd-title {
  font-size: 15px; font-weight: 700; color: #1e1b4b; margin-bottom: 22px;
  display: flex; align-items: center; gap: 8px;
}

/* Upload label wrapper */
.pf-upload-label {
  display: block; width: 100%; cursor: pointer;
}

/* Toast */
.pf-toast {
  position: fixed; bottom: 28px; right: 28px;
  background: #1e1b4b; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  padding: 14px 22px; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(30,27,75,0.25);
  display: flex; align-items: center; gap: 10px;
  z-index: 9999; animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1);
}
.pf-toast.success { background: #064e3b; }
.pf-toast.error   { background: #7f1d1d; }

@keyframes pfFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

const TABS = ["Profile", "Security"];

function Profile() {
  const [user, setUser] = useState({
    name: "", email: "", department: "", contactNumber: "", address: "", role: ""
  });
  const [leaveStats, setLeaveStats]   = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [activeTab, setActiveTab]     = useState("Profile");
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdSaving, setPwdSaving]     = useState(false);
  const [file, setFile]               = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/leaves/stats");
      setLeaveStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [fetchProfile, fetchStats]);

  // Auto-upload when a new file is selected
  useEffect(() => {
    if (file) {
      uploadImage();
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const uploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      showToast("✅  Photo updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("❌  Image upload failed", "error");
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      await API.put("/profile", user);
      showToast("✅  Profile updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("❌  Update failed. Try again.", "error");
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) { showToast("Please fill all password fields", "error"); return; }
    if (newPassword.length < 6)       { showToast("New password must be at least 6 characters", "error"); return; }
    if (newPassword !== confirmPwd)   { showToast("Passwords do not match", "error"); return; }
    setPwdSaving(true);
    try {
      await API.put("/profile/password", { oldPassword, newPassword });
      showToast("✅  Password changed successfully", "success");
      setOldPassword(""); setNewPassword(""); setConfirmPwd("");
    } catch (err) {
      showToast("❌  Incorrect current password", "error");
    }
    setPwdSaving(false);
  };

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const role = user.role || localStorage.getItem("role") || "EMPLOYEE";

  const statCards = [
    { label: "Total Leaves", value: leaveStats.total,    icon: "📋", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Pending",      value: leaveStats.pending,  icon: "⏳", bg: "#fffbeb", color: "#b45309" },
    { label: "Approved",     value: leaveStats.approved, icon: "✅", bg: "#f0fdf4", color: "#065f46" },
    { label: "Rejected",     value: leaveStats.rejected, icon: "❌", bg: "#fef2f2", color: "#991b1b" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="pf-root">
        <Navbar />
        <div className="pf-body">

          <div className="pf-page-header">
            <div className="pf-page-title">My Profile</div>
            <div className="pf-page-sub">Manage your personal information and account settings</div>
          </div>

          {/* Stats */}
          <div className="pf-stats-row" style={{ marginBottom: 24 }}>
            {statCards.map((s, i) => (
              <div className="pf-stat-card" key={i}>
                <div className="pf-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="pf-stat-label">{s.label}</div>
                  <div className="pf-stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pf-grid">

            {/* Left: avatar card */}
            <div className="pf-avatar-card">
              <div className="pf-avatar-wrap">
                {user.profileImage ? (
                  <img
                    src={`http://localhost:8080/uploads/${user.profileImage}`}
                    className="pf-avatar"
                    style={{ objectFit: "cover" }}
                    alt={user.name || "Profile"}
                  />
                ) : (
                  <div className="pf-avatar">{initials}</div>
                )}
                <div className="pf-avatar-ring" />
                <div className="pf-avatar-online" title="Active" />
              </div>

              <div className="pf-avatar-name">{user.name || "—"}</div>
              <div className={`pf-avatar-role ${role}`}>{role}</div>

              <div className="pf-info-chips">
                <div className="pf-info-chip">
                  <span className="pf-chip-icon">✉️</span>
                  <div className="pf-chip-body">
                    <div className="pf-chip-label">Email</div>
                    <div className="pf-chip-value">{user.email || "—"}</div>
                  </div>
                </div>
                <div className="pf-info-chip">
                  <span className="pf-chip-icon">🏢</span>
                  <div className="pf-chip-body">
                    <div className="pf-chip-label">Department</div>
                    <div className="pf-chip-value">{user.department || "—"}</div>
                  </div>
                </div>
                <div className="pf-info-chip">
                  <span className="pf-chip-icon">📞</span>
                  <div className="pf-chip-body">
                    <div className="pf-chip-label">Contact</div>
                    <div className="pf-chip-value">{user.contactNumber || "—"}</div>
                  </div>
                </div>
                <div className="pf-info-chip">
                  <span className="pf-chip-icon">🪪</span>
                  <div className="pf-chip-body">
                    <div className="pf-chip-label">Employee ID</div>
                    <div className="pf-chip-value">#{user.id || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Hidden file input + label triggers it */}
              <input
                type="file"
                id="upload-photo"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="upload-photo" className="pf-upload-label">
                <button
                  className="pf-change-photo"
                  onClick={() => document.getElementById("upload-photo").click()}
                >
                  📷 Change Photo
                </button>
              </label>

            </div>

            {/* Right: tabs + forms */}
            <div className="pf-right">

              <div className="pf-tabs">
                {TABS.map((t) => (
                  <button
                    key={t}
                    className={`pf-tab ${activeTab === t ? "active" : ""}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t === "Profile" ? "👤 Profile" : "🔒 Security"}
                  </button>
                ))}
              </div>

              {/* Profile tab */}
              {activeTab === "Profile" && (
                <div className="pf-form-card">
                  <div className="pf-form-section-title"><span>👤</span> Personal Information</div>

                  <div className="pf-form-grid2">
                    <div className="pf-field">
                      <label className="pf-label">Full Name</label>
                      <input className="pf-input" placeholder="John Doe"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Email Address</label>
                      <input className="pf-input" placeholder="john@company.com"
                        value={user.email || ""} disabled />
                      <div className="pf-locked-hint">🔒 Email cannot be changed</div>
                    </div>
                  </div>

                  <div className="pf-form-grid2">
                    <div className="pf-field">
                      <label className="pf-label">Department</label>
                      <select className="pf-select" value={user.department || ""}
                        onChange={(e) => setUser({ ...user, department: e.target.value })}>
                        <option value="">Select department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="FINANCE">Finance</option>
                        <option value="SALES">Sales</option>
                      </select>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Contact Number</label>
                      <input className="pf-input" placeholder="+91 98765 43210"
                        value={user.contactNumber || ""}
                        onChange={(e) => setUser({ ...user, contactNumber: e.target.value })} />
                    </div>
                  </div>

                  <div className="pf-field">
                    <label className="pf-label">Address</label>
                    <textarea className="pf-textarea" placeholder="Your home or office address…"
                      value={user.address || ""}
                      onChange={(e) => setUser({ ...user, address: e.target.value })} />
                  </div>

                  <div className="pf-save-row">
                    <span className="pf-save-hint">All fields except email are editable</span>
                    <button className="pf-save-btn" onClick={updateProfile} disabled={saving}>
                      {saving ? "Saving…" : "Save Changes →"}
                    </button>
                  </div>
                </div>
              )}

              {/* Security tab */}
              {activeTab === "Security" && (
                <div className="pf-pwd-card">
                  <div className="pf-pwd-title"><span>🔒</span> Change Password</div>

                  <div className="pf-field">
                    <label className="pf-label">Current Password</label>
                    <input className="pf-input" type="password" placeholder="••••••••"
                      value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  </div>

                  <div className="pf-form-grid2">
                    <div className="pf-field">
                      <label className="pf-label">New Password</label>
                      <input className="pf-input" type="password" placeholder="Min 6 characters"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Confirm New Password</label>
                      <input className="pf-input" type="password" placeholder="Repeat new password"
                        value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                    </div>
                  </div>

                  {/* Password strength bar */}
                  {newPassword.length > 0 && (() => {
                    const strength =
                      newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 4
                      : newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 3
                      : newPassword.length >= 6 ? 2 : 1;
                    const colors  = ["#ef4444","#f59e0b","#3b82f6","#22c55e"];
                    const labels  = ["Too short","Weak","Moderate","Strong 💪"];
                    return (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Password Strength
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {[1,2,3,4].map((level) => (
                            <div key={level} style={{
                              flex: 1, height: 5, borderRadius: 100,
                              background: level <= strength ? colors[strength - 1] : "#e5e7eb",
                              transition: "background 0.3s",
                            }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5, fontWeight: 600 }}>
                          {labels[strength - 1]}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pf-save-row">
                    <span className="pf-save-hint">Use a strong, unique password</span>
                    <button className="pf-save-btn" onClick={changePassword} disabled={pwdSaving}>
                      {pwdSaving ? "Updating…" : "Update Password →"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`pf-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}

export default Profile;