import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/logo.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.elms-root {
  min-height: 100vh;
  display: flex;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
}

/* ── LEFT PANEL ── */
.elms-left {
  width: 460px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #4338ca 0%, #6366f1 55%, #818cf8 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 52px;
  position: relative;
  overflow: hidden;
}
.elms-left::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 340px; height: 340px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
  pointer-events: none;
}
.elms-left::after {
  content: '';
  position: absolute;
  bottom: -80px; left: -80px;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  pointer-events: none;
}

.elms-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.elms-brand-logo {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 8px;
  object-fit: contain;
}
.elms-brand-name {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}
.elms-brand-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
}

.elms-hero {
  position: relative;
  z-index: 1;
}
.elms-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 28px;
}
.elms-hero-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #86efac;
  box-shadow: 0 0 8px #86efac;
  animation: pulseDot 2s ease-in-out infinite;
}
.elms-hero-tag-text {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.elms-hero h1 {
  font-size: clamp(28px, 3vw, 46px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}
.elms-hero p {
  font-size: 15px;
  color: rgba(255,255,255,0.62);
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 340px;
}

.elms-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.elms-feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
}
.elms-feature-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.elms-feature-text {
  font-size: 14px;
  color: rgba(255,255,255,0.78);
  font-weight: 500;
}
.elms-left-footer {
  position: relative;
  z-index: 1;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  font-weight: 500;
}

/* ── RIGHT PANEL ── */
.elms-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: #f0f4ff;
  position: relative;
}
.elms-right::before {
  content: '';
  position: absolute;
  bottom: -80px; right: -80px;
  width: 380px; height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.elms-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  padding: 48px 44px;
  box-shadow:
    0 1px 2px rgba(99,102,241,0.06),
    0 8px 32px rgba(99,102,241,0.1),
    0 24px 64px rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.09);
  animation: slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
}

.elms-card-title {
  font-size: 26px;
  font-weight: 800;
  color: #1e1b4b;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}
.elms-card-sub {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 36px;
  font-weight: 500;
}

.elms-field { margin-bottom: 20px; }

.elms-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.elms-input-wrap { position: relative; }

.elms-input {
  width: 100%;
  background: #f8f9ff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 15px;
  color: #1e1b4b;
  outline: none;
  font-family: inherit;
  font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}
.elms-input::placeholder { color: #d1d5db; font-weight: 400; }
.elms-input:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
}

.elms-eye {
  position: absolute;
  right: 14px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer; color: #d1d5db;
  display: flex; align-items: center; padding: 0;
  transition: color 0.2s;
}
.elms-eye:hover { color: #6366f1; }

.elms-btn {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 16px rgba(99,102,241,0.32), 0 1px 0 rgba(255,255,255,0.15) inset;
  transition: transform 0.15s, box-shadow 0.15s;
  margin-top: 8px;
}
.elms-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(99,102,241,0.42);
}
.elms-btn:active:not(:disabled) { transform: translateY(0); }
.elms-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.elms-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 0;
  font-size: 13px;
  color: #d1d5db;
  font-weight: 500;
}
.elms-divider-line { flex: 1; height: 1px; background: #f3f4f6; }

.elms-footer-text {
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
  margin-top: 22px;
  font-weight: 500;
}
.elms-footer-text a {
  color: #4338ca;
  font-weight: 700;
  text-decoration: none;
}
.elms-footer-text a:hover { text-decoration: underline; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseDot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.4; transform:scale(0.75); }
}
`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);
      if (res.data.role === "ADMIN") navigate("/admin");
      else if (res.data.role === "MANAGER") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      alert("Invalid email or password");
    }
    setLoading(false);
  };

  const features = [
    { icon: "📅", text: "Apply & track leave in real-time" },
    { icon: "✅", text: "One-click manager approvals" },
    { icon: "📊", text: "Analytics & leave balance reports" },
    { icon: "🔔", text: "Instant notifications & alerts" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="elms-root">

        {/* LEFT */}
        <div className="elms-left">
          <div className="elms-brand">
            <img src={logo} alt="logo" className="elms-brand-logo" />
            <div>
              <div className="elms-brand-name">ELMS</div>
              <div className="elms-brand-sub">Leave Management System</div>
            </div>
          </div>

          <div className="elms-hero">
            <div className="elms-hero-tag">
              <div className="elms-hero-dot" />
              <span className="elms-hero-tag-text">Now live</span>
            </div>
            <h1>Manage leave,<br />the smart way.</h1>
            <p>
              ELMS helps your entire workforce handle leave requests,
              approvals and HR workflows — fast, transparent, and hassle-free.
            </p>
            <div className="elms-features">
              {features.map((f, i) => (
                <div className="elms-feature-item" key={i}>
                  <div className="elms-feature-icon">{f.icon}</div>
                  <span className="elms-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="elms-left-footer">© 2025 ELMS · All rights reserved.</div>
        </div>

        {/* RIGHT */}
        <div className="elms-right">
          <div className="elms-card">
            <div className="elms-card-title">Welcome back 👋</div>
            <div className="elms-card-sub">Sign in to your ELMS account</div>

            <form onSubmit={login}>
              <div className="elms-field">
                <label className="elms-label">Email Address</label>
                <div className="elms-input-wrap">
                  <input
                    className="elms-input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="elms-field">
                <label className="elms-label">Password</label>
                <div className="elms-input-wrap">
                  <input
                    className="elms-input"
                    style={{ paddingRight: 48 }}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="elms-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                      ? <VisibilityOff style={{ fontSize: 20 }} />
                      : <Visibility style={{ fontSize: 20 }} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="elms-btn" disabled={loading}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div className="elms-divider">
              <div className="elms-divider-line" />
              <span>New here?</span>
              <div className="elms-divider-line" />
            </div>

            <p className="elms-footer-text">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;
