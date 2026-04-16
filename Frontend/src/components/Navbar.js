import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.nav-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #ffffff;
  border-bottom: 1px solid #e8eaf6;
  box-shadow: 0 1px 0 rgba(99,102,241,0.06), 0 4px 16px rgba(99,102,241,0.06);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 200;
}

/* Brand */
.nav-brand {
  display: flex; align-items: center; gap: 10px; text-decoration: none;
}
.nav-brand-logo {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  border-radius: 10px; padding: 7px; object-fit: contain;
}
.nav-brand-name {
  font-size: 18px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.02em;
}

/* Links */
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-link {
  font-size: 14px; font-weight: 600; color: #6b7280;
  text-decoration: none; padding: 7px 14px; border-radius: 8px;
  transition: background 0.18s, color 0.18s;
}
.nav-link:hover  { background: #f0f4ff; color: #4338ca; }
.nav-link.active { background: #ede9fe; color: #4338ca; }

/* Right */
.nav-right { display: flex; align-items: center; gap: 14px; }

/* ── Notification bell ── */
.nav-bell-wrap { position: relative; }
.nav-bell-btn {
  width: 38px; height: 38px; border-radius: 10px;
  border: 1.5px solid #e8eaf6; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 17px;
  transition: background 0.18s, border-color 0.18s;
  position: relative; flex-shrink: 0;
}
.nav-bell-btn:hover { background: #f0f4ff; border-color: #c7d2fe; }
.nav-bell-btn.has-notif {
  border-color: #fca5a5; background: #fef2f2;
  animation: bellShake 0.5s ease;
}

/* Count badge */
.nav-bell-count {
  position: absolute; top: -6px; right: -6px;
  min-width: 18px; height: 18px;
  background: #ef4444; color: #fff;
  font-size: 10px; font-weight: 800; border-radius: 100px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; border: 2px solid #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  animation: badgePop 0.25s cubic-bezier(0.22,1,0.36,1);
}

/* Dropdown panel */
.nav-dropdown {
  position: absolute; right: 0; top: calc(100% + 10px);
  width: 340px; background: #fff; border-radius: 16px;
  border: 1px solid rgba(99,102,241,0.1);
  box-shadow: 0 8px 32px rgba(99,102,241,0.14), 0 2px 8px rgba(99,102,241,0.08);
  z-index: 300; overflow: hidden;
  animation: dropDown 0.2s cubic-bezier(0.22,1,0.36,1);
}

/* Dropdown header */
.nav-dropdown-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 12px; border-bottom: 1px solid #f3f4f6;
}
.nav-dropdown-left { display: flex; align-items: center; gap: 8px; }
.nav-dropdown-title { font-size: 13px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.01em; }
.nav-dropdown-count {
  font-size: 11px; font-weight: 700; color: #ef4444;
  background: #fee2e2; padding: 2px 8px; border-radius: 100px;
}
.nav-dropdown-count.zero { color: #6b7280; background: #f3f4f6; }

/* Header action buttons row */
.nav-dropdown-actions {
  display: flex; gap: 6px;
}

/* Mark all read button */
.nav-mark-read {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700; color: #4338ca;
  background: none; border: 1.5px solid #c7d2fe;
  border-radius: 7px; padding: 4px 10px;
  cursor: pointer; transition: all 0.18s; white-space: nowrap;
}
.nav-mark-read:hover { background: #ede9fe; border-color: #a5b4fc; }

/* Clear All button */
.nav-clear-all {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700; color: #6b7280;
  background: none; border: 1.5px solid #e5e7eb;
  border-radius: 7px; padding: 4px 10px;
  cursor: pointer; transition: all 0.18s; white-space: nowrap;
}
.nav-clear-all:hover { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }

/* Notification list */
.nav-notif-list { max-height: 280px; overflow-y: auto; }
.nav-notif-list::-webkit-scrollbar { width: 4px; }
.nav-notif-list::-webkit-scrollbar-thumb { background: #e0e0f5; border-radius: 4px; }

/* Each row */
.nav-notif-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 16px; border-bottom: 1px solid #f9fafb;
  transition: background 0.15s; position: relative;
}
.nav-notif-item:last-child { border-bottom: none; }
.nav-notif-item:hover { background: #fafbff; }
.nav-notif-item:hover .nav-notif-delete { opacity: 1; }

/* Unread dot indicator */
.nav-notif-item.unread { background: #fafbff; }
.nav-notif-item.unread::before {
  content: '';
  position: absolute; left: 6px; top: 50%; transform: translateY(-50%);
  width: 5px; height: 5px; border-radius: 50%; background: #6366f1;
}

.nav-notif-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: #ede9fe; color: #6366f1;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.nav-notif-msg {
  font-size: 13px; font-weight: 500; color: #374151;
  line-height: 1.5; flex: 1; padding-right: 8px;
}

/* Per-item delete × */
.nav-notif-delete {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 22px; height: 22px; border-radius: 6px;
  border: none; background: #fee2e2; color: #dc2626;
  font-size: 13px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0;
  transition: opacity 0.18s, background 0.18s;
  line-height: 1; flex-shrink: 0;
}
.nav-notif-delete:hover { background: #dc2626; color: #fff; }

.nav-notif-empty {
  text-align: center; padding: 32px 16px;
  font-size: 13px; font-weight: 600; color: #9ca3af;
}

/* Role badge */
.nav-role-badge {
  font-size: 11px; font-weight: 700; padding: 4px 12px;
  border-radius: 100px; border: 1.5px solid; letter-spacing: 0.04em;
}
.nav-role-badge.ADMIN    { color: #7c3aed; border-color: #ddd6fe; background: #f5f3ff; }
.nav-role-badge.MANAGER  { color: #0f766e; border-color: #ccfbf1; background: #f0fdf4; }
.nav-role-badge.EMPLOYEE { color: #1d4ed8; border-color: #bfdbfe; background: #eff6ff; }

/* Logout */
.nav-logout {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 8px 18px; border-radius: 8px;
  border: 1.5px solid #e0e0f0; background: #fff; color: #6b7280;
  cursor: pointer; transition: all 0.18s;
}
.nav-logout:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }

/* Animations */
@keyframes bellShake {
  0%,100% { transform: rotate(0); }
  20%      { transform: rotate(-12deg); }
  40%      { transform: rotate(12deg); }
  60%      { transform: rotate(-8deg); }
  80%      { transform: rotate(8deg); }
}
@keyframes badgePop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes dropDown {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

function Navbar() {
  const navigate = useNavigate();
  const role     = localStorage.getItem("role");
  const path     = window.location.pathname;

  const [notifications, setNotifications] = useState([]);
  const [count, setCount]                 = useState(0);
  const [open, setOpen]                   = useState(false);
  const bellRef                           = useRef(null);

  // ── Fetch full notification list ─────────────────────────────────────────
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ── Fetch unread count ───────────────────────────────────────────────────
  const fetchCount = async () => {
    try {
      const res = await API.get("/notifications/count");
      setCount(res.data);
    } catch (err) {
      // silently ignore
    }
  };

  // ── Poll BOTH every 5 seconds ────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
    fetchCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchCount();
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handleOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Toggle bell ──────────────────────────────────────────────────────────
  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  // ── Mark ALL as read ─────────────────────────────────────────────────────
  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setCount(0); // clear badge immediately
      fetchNotifications(); // refresh list to remove unread indicators
    } catch (err) {
      console.error(err);
    }
  };

  // ── Clear ALL notifications ──────────────────────────────────────────────
  const clearAll = async () => {
    try {
      await API.delete("/notifications/clear");
      fetchNotifications();
      fetchCount();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete ONE notification ──────────────────────────────────────────────
  const deleteOne = async (id, e) => {
    e.stopPropagation();
    try {
      await API.delete("/notifications/" + id);
      fetchNotifications();
      fetchCount();
    } catch (err) {
      console.error(err);
    }
  };

  const logout   = () => { localStorage.clear(); navigate("/login"); };
  const isActive = (to) => path === to ? "nav-link active" : "nav-link";

  const hasActions = notifications.length > 0;

  return (
    <>
      <style>{css}</style>
      <nav className="nav-root">

        {/* Brand */}
        <Link to={
          role === "ADMIN"   ? "/admin"   :
          role === "MANAGER" ? "/manager" : "/employee"
        } className="nav-brand">
          <img src={logo} alt="logo" className="nav-brand-logo" />
          <span className="nav-brand-name">ELMS</span>
        </Link>

        {/* Nav links */}
        <div className="nav-links">
          {role === "EMPLOYEE" && (
            <>
              <Link className={isActive("/employee")} to="/employee">Dashboard</Link>
              <Link className={isActive("/apply")}    to="/apply">Apply Leave</Link>
              <Link className={isActive("/history")}  to="/history">Leave History</Link>
              <Link className={isActive("/calendar")} to="/calendar">Calendar</Link>
              <Link className={isActive("/profile")}  to="/profile">Profile</Link>
            </>
          )}
          {role === "MANAGER" && (
            <>
              <Link className={isActive("/manager")}       to="/manager">Dashboard</Link>
              <Link className={isActive("/manager/panel")} to="/manager/panel">Leave Requests</Link>
              <Link className={isActive("/manager/users")} to="/manager/users">Employees</Link>
              <Link className={isActive("/profile")}       to="/profile">Profile</Link>
              <Link className={isActive("/balance")}       to="/manager/balance">Manage Balance</Link>
              <Link className={isActive("/calender")}      to="/manager/calendar">Calendar</Link>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <Link className={isActive("/admin")}        to="/admin">Dashboard</Link>
              <Link className={isActive("/admin/users")}  to="/admin/users">Manage Users</Link>
              <Link className={isActive("/admin/leaves")} to="/admin/leaves">All Leaves</Link>
              <Link className={isActive("/profile")}      to="/profile">Profile</Link>
              <Link className={isActive("/balance")}       to="/manager/balance">Manage Balance</Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="nav-right">

          {/* 🔔 Bell */}
          <div className="nav-bell-wrap" ref={bellRef}>
            <button
              className={`nav-bell-btn ${count > 0 ? "has-notif" : ""}`}
              onClick={handleBellClick}
              title="Notifications"
            >
              🔔
              {count > 0 && (
                <span className="nav-bell-count">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>

            {open && (
              <div className="nav-dropdown">

                {/* Header */}
                <div className="nav-dropdown-header">
                  <div className="nav-dropdown-left">
                    <span className="nav-dropdown-title">Notifications</span>
                    <span className={`nav-dropdown-count ${count === 0 ? "zero" : ""}`}>
                      {count > 0 ? `${count} new` : "All clear"}
                    </span>
                  </div>

                  {/* Action buttons: Mark Read + Clear All */}
                  {hasActions && (
                    <div className="nav-dropdown-actions">
                      <button className="nav-mark-read" onClick={markAllRead}>
                        ✓ Mark read
                      </button>
                      <button className="nav-clear-all" onClick={clearAll}>
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* List */}
                <div className="nav-notif-list">
                  {notifications.length === 0 ? (
                    <div className="nav-notif-empty">
                      🎉 You're all caught up!
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`nav-notif-item ${!n.read ? "unread" : ""}`}
                      >
                        <div className="nav-notif-icon">📋</div>
                        <div className="nav-notif-msg">{n.message}</div>
                        <button
                          className="nav-notif-delete"
                          onClick={(e) => deleteOne(n.id, e)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {role && <span className={`nav-role-badge ${role}`}>{role}</span>}
          <button className="nav-logout" onClick={logout}>Logout</button>

        </div>
      </nav>
    </>
  );
}

export default Navbar;