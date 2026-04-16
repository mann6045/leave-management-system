import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.footer-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #ffffff;
  border-top: 1px solid #e8eaf6;
  margin-top: auto;
}

/* ── Top section ── */
.footer-top {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 40px 36px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
}

/* Brand column */
.footer-brand { display: flex; flex-direction: column; gap: 0; }
.footer-brand-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
}
.footer-brand-logo {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  border-radius: 11px; padding: 7px; object-fit: contain;
}
.footer-brand-name {
  font-size: 20px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.02em;
}
.footer-brand-desc {
  font-size: 14px; color: #9ca3af; line-height: 1.75;
  max-width: 280px; font-weight: 500; margin-bottom: 24px;
}

/* Status pill */
.footer-status {
  display: inline-flex; align-items: center; gap: 7px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 100px; padding: 6px 14px;
  width: fit-content; margin-bottom: 24px;
}
.footer-status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
  animation: footerPulse 2s ease-in-out infinite;
}
.footer-status-text {
  font-size: 12px; font-weight: 700; color: #15803d; letter-spacing: 0.04em;
}

/* Social icons */
.footer-socials { display: flex; gap: 8px; }
.footer-social-btn {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid #e8eaf6; background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer; text-decoration: none;
  transition: all 0.18s; color: #6b7280;
}
.footer-social-btn:hover {
  background: #f0f4ff; border-color: #c7d2fe; color: #4338ca;
  transform: translateY(-2px);
}

/* Link columns */
.footer-col-title {
  font-size: 12px; font-weight: 800; color: #1e1b4b;
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
}
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-link {
  font-size: 14px; font-weight: 500; color: #6b7280;
  text-decoration: none; transition: color 0.18s;
  display: flex; align-items: center; gap: 6px;
}
.footer-link:hover { color: #4338ca; }
.footer-link-badge {
  font-size: 10px; font-weight: 700; padding: 2px 7px;
  border-radius: 100px; background: #ede9fe; color: #6d28d9;
}

/* ── Divider ── */
.footer-divider {
  max-width: 1280px; margin: 0 auto;
  height: 1px; background: #f0f0f8;
  margin-left: 40px; margin-right: 40px;
}

/* ── Bottom bar ── */
.footer-bottom {
  max-width: 1280px; margin: 0 auto;
  padding: 20px 40px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.footer-copy {
  font-size: 13px; color: #9ca3af; font-weight: 500;
}
.footer-copy strong { color: #6b7280; font-weight: 700; }

/* Tech stack pills */
.footer-tech {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.footer-tech-label {
  font-size: 12px; font-weight: 600; color: #c4c6d8;
}
.footer-tech-pill {
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
  border: 1.5px solid #e8eaf6; color: #9ca3af;
  background: #fafbff; transition: all 0.18s;
}
.footer-tech-pill:hover { border-color: #c7d2fe; color: #4338ca; background: #f0f4ff; }

/* Made with love */
.footer-made {
  font-size: 13px; color: #9ca3af; font-weight: 500;
  display: flex; align-items: center; gap: 5px;
}
.footer-heart { color: #f43f5e; animation: heartBeat 1.4s ease-in-out infinite; }

@keyframes footerPulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.8); }
}
@keyframes heartBeat {
  0%,100% { transform: scale(1); }
  14%      { transform: scale(1.3); }
  28%      { transform: scale(1); }
  42%      { transform: scale(1.2); }
  70%      { transform: scale(1); }
}

@media (max-width: 900px) {
  .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; padding: 36px 24px 28px; }
  .footer-brand { grid-column: span 2; }
  .footer-bottom { padding: 16px 24px; flex-direction: column; align-items: flex-start; }
  .footer-divider { margin-left: 24px; margin-right: 24px; }
}
@media (max-width: 560px) {
  .footer-top { grid-template-columns: 1fr; }
  .footer-brand { grid-column: span 1; }
}
`;

const NAV_LINKS = {
  EMPLOYEE: [
    { label: "Dashboard",     to: "/employee" },
    { label: "Apply Leave",   to: "/apply" },
    { label: "Leave History", to: "/history" },
    { label: "Calendar",      to: "/calendar" },
    { label: "My Profile",    to: "/profile" },
  ],
  MANAGER: [
    { label: "Dashboard",      to: "/manager" },
    { label: "Leave Requests", to: "/manager/panel", badge: "New" },
    { label: "Employees",      to: "/manager/users" },
    { label: "My Profile",     to: "/profile" },
  ],
  ADMIN: [
    { label: "Dashboard",    to: "/admin" },
    { label: "Manage Users", to: "/admin/users" },
    { label: "All Leaves",   to: "/admin/leaves" },
    { label: "My Profile",   to: "/profile" },
  ],
};

const SUPPORT_LINKS = [
  { label: "Help Center",      to: "#" },
  { label: "Privacy Policy",   to: "#" },
  { label: "Terms of Service", to: "#" },
  { label: "Contact HR",       to: "#" },
];

const LEAVE_TYPES = [
  { label: "Sick Leave",    to: "#" },
  { label: "Casual Leave",  to: "#" },
  { label: "Paid Leave",    to: "#" },
  { label: "Leave Balance", to: "#" },
];

const TECH_PILLS = ["React", "Spring Boot", "MySQL", "JWT"];

const SOCIALS = [
  { icon: "💼", label: "LinkedIn", href: "#" },
  { icon: "🐙", label: "GitHub",   href: "#" },
  { icon: "🐦", label: "Twitter",  href: "#" },
];

function Footer() {
  // ── Read role inside the component (not at module level) ─────────────────
  const currentRole = localStorage.getItem("role") || "EMPLOYEE";
  const navLinks    = NAV_LINKS[currentRole] || NAV_LINKS.EMPLOYEE;
  const year        = new Date().getFullYear();

  return (
    <>
      <style>{css}</style>
      <footer className="footer-root">

        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img src={logo} alt="ELMS logo" className="footer-brand-logo" />
              <span className="footer-brand-name">ELMS</span>
            </div>
            <p className="footer-brand-desc">
              Employee Leave Management System — a smart, unified platform for
              managing leave requests, approvals, and HR workflows across your organisation.
            </p>
            <div className="footer-status">
              <div className="footer-status-dot" />
              <span className="footer-status-text">All systems operational</span>
            </div>
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className="footer-social-btn"
                  title={s.label} target="_blank" rel="noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <div className="footer-links">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} className="footer-link">
                  {l.label}
                  {l.badge && <span className="footer-link-badge">{l.badge}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Leave Types */}
          <div>
            <div className="footer-col-title">Leave Types</div>
            <div className="footer-links">
              {LEAVE_TYPES.map((l) => (
                <Link key={l.label} to={l.to} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <div className="footer-col-title">Support</div>
            <div className="footer-links">
              {SUPPORT_LINKS.map((l) => (
                <Link key={l.label} to={l.to} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copy">
            © {year} <strong>ELMS</strong> · Employee Leave Management System. All rights reserved.
          </div>
          <div className="footer-tech">
            <span className="footer-tech-label">Built with</span>
            {TECH_PILLS.map((t) => (
              <span key={t} className="footer-tech-pill">{t}</span>
            ))}
          </div>
          <div className="footer-made">
            Made with <span className="footer-heart">♥</span> for better HR
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;
