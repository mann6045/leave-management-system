import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/logo.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.reg-root {
  min-height: 100vh;
  display: flex;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
}

/* ── LEFT PANEL ── */
.reg-left {
  width: 400px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #0f766e 0%, #0d9488 50%, #2dd4bf 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 52px;
  position: relative;
  overflow: hidden;
}
.reg-left::before {
  content: '';
  position: absolute;
  top: -90px; right: -90px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
  pointer-events: none;
}
.reg-left::after {
  content: '';
  position: absolute;
  bottom: -70px; left: -70px;
  width: 260px; height: 260px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  pointer-events: none;
}

.reg-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.reg-brand-logo {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 8px;
  object-fit: contain;
}
.reg-brand-name {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}
.reg-brand-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
}

.reg-hero {
  position: relative;
  z-index: 1;
}
.reg-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 28px;
}
.reg-hero-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #fde68a;
  box-shadow: 0 0 8px #fde68a;
  animation: regDot 2s ease-in-out infinite;
}
.reg-hero-tag-text {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.reg-hero h1 {
  font-size: clamp(26px, 2.8vw, 42px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}
.reg-hero p {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  line-height: 1.8;
  margin-bottom: 44px;
}

/* Steps */
.reg-steps { display: flex; flex-direction: column; gap: 0; }
.reg-step-row { display: flex; gap: 16px; align-items: flex-start; }
.reg-step-left {
  display: flex; flex-direction: column;
  align-items: center; padding-top: 2px;
}
.reg-step-num {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.reg-step-line {
  width: 2px; height: 30px;
  background: rgba(255,255,255,0.12);
  margin: 4px 0;
}
.reg-step-body { padding-bottom: 22px; }
.reg-step-title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  margin-bottom: 3px;
}
.reg-step-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
}

.reg-left-footer {
  position: relative; z-index: 1;
  font-size: 12px;
  color: rgba(255,255,255,0.28);
  font-weight: 500;
}

/* ── RIGHT PANEL ── */
.reg-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f0f4ff;
  position: relative;
}
.reg-right::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 360px; height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.reg-card {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 24px;
  padding: 44px 48px;
  box-shadow:
    0 1px 2px rgba(13,148,136,0.06),
    0 8px 32px rgba(13,148,136,0.1),
    0 24px 64px rgba(13,148,136,0.07);
  border: 1px solid rgba(13,148,136,0.09);
  animation: regSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
}

.reg-card-title {
  font-size: 24px;
  font-weight: 800;
  color: #134e4a;
  letter-spacing: -0.03em;
  margin-bottom: 5px;
}
.reg-card-sub {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 30px;
  font-weight: 500;
}

.reg-grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.reg-field { margin-bottom: 18px; }

.reg-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.reg-input-wrap { position: relative; }

.reg-input, .reg-select {
  width: 100%;
  background: #f8fffe;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #134e4a;
  outline: none;
  font-family: inherit;
  font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}
.reg-input::placeholder { color: #d1d5db; font-weight: 400; }
.reg-input:focus, .reg-select:focus {
  border-color: #0d9488;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(13,148,136,0.1);
}

.reg-select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-color: #f8fffe;
}

.reg-eye {
  position: absolute; right: 13px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer; color: #d1d5db;
  display: flex; align-items: center; padding: 0;
  transition: color 0.2s;
}
.reg-eye:hover { color: #0d9488; }

.reg-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
  font-weight: 600;
}

.reg-btn {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #0f766e, #0d9488);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 16px rgba(13,148,136,0.32), 0 1px 0 rgba(255,255,255,0.15) inset;
  transition: transform 0.15s, box-shadow 0.15s;
  margin-top: 8px;
}
.reg-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(13,148,136,0.42);
}
.reg-btn:active:not(:disabled) { transform: translateY(0); }
.reg-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.reg-footer-text {
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
  margin-top: 22px;
  font-weight: 500;
}
.reg-footer-text a {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}
.reg-footer-text a:hover { text-decoration: underline; }

@keyframes regSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes regDot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.4; transform:scale(0.75); }
}
`;

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!name.trim()) temp.name = "Name is required";
    if (!email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) temp.email = "Invalid email format";
    if (!password) temp.password = "Password is required";
    else if (password.length < 6) temp.password = "Min 6 characters required";
    if (password !== confirmPassword) temp.confirmPassword = "Passwords do not match";
    if (!department) temp.department = "Department is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const registerUser = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await API.post("/auth/register", {
        name, email, password, department, role: "EMPLOYEE",
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
    setLoading(false);
  };

  const steps = [
    { title: "Create Account", desc: "Fill in your personal details below" },
    { title: "Get Verified", desc: "Your manager will activate your profile" },
    { title: "Start Using ELMS", desc: "Apply for leave & track everything" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="reg-root">

        {/* LEFT */}
        <div className="reg-left">
          <div className="reg-brand">
            <img src={logo} alt="logo" className="reg-brand-logo" />
            <div>
              <div className="reg-brand-name">ELMS</div>
              <div className="reg-brand-sub">Leave Management System</div>
            </div>
          </div>

          <div className="reg-hero">
            <div className="reg-hero-tag">
              <div className="reg-hero-dot" />
              <span className="reg-hero-tag-text">New Account</span>
            </div>
            <h1>Get started<br />in minutes.</h1>
            <p>
              Join your team on ELMS and manage leave seamlessly — from application to approval.
            </p>

            <div className="reg-steps">
              {steps.map((s, i) => (
                <div className="reg-step-row" key={i}>
                  <div className="reg-step-left">
                    <div className="reg-step-num">{i + 1}</div>
                    {i < steps.length - 1 && <div className="reg-step-line" />}
                  </div>
                  <div className="reg-step-body">
                    <div className="reg-step-title">{s.title}</div>
                    <div className="reg-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reg-left-footer">© 2025 ELMS · All rights reserved.</div>
        </div>

        {/* RIGHT */}
        <div className="reg-right">
          <div className="reg-card">
            <div className="reg-card-title">Create your account</div>
            <div className="reg-card-sub">Fill in the details below to get started</div>

            {/* Row 1: Name + Department */}
            <div className="reg-grid2">
              <div className="reg-field">
                <label className="reg-label">Full Name</label>
                <input
                  className="reg-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="reg-error">⚠ {errors.name}</div>}
              </div>
              <div className="reg-field">
                <label className="reg-label">Department</label>
                <select
                  className="reg-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="FINANCE">Finance</option>
                  <option value="SALES">Sales</option>
                </select>
                {errors.department && <div className="reg-error">⚠ {errors.department}</div>}
              </div>
            </div>

            {/* Email full width */}
            <div className="reg-field">
              <label className="reg-label">Email Address</label>
              <input
                className="reg-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="reg-error">⚠ {errors.email}</div>}
            </div>

            {/* Row 2: Password + Confirm */}
            <div className="reg-grid2">
              <div className="reg-field">
                <label className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <input
                    className="reg-input"
                    style={{ paddingRight: 44 }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="reg-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                      ? <VisibilityOff style={{ fontSize: 18 }} />
                      : <Visibility style={{ fontSize: 18 }} />}
                  </button>
                </div>
                {errors.password && <div className="reg-error">⚠ {errors.password}</div>}
              </div>
              <div className="reg-field">
                <label className="reg-label">Confirm Password</label>
                <input
                  className="reg-input"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="reg-error">⚠ {errors.confirmPassword}</div>}
              </div>
            </div>

            <button
              className="reg-btn"
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>

            <p className="reg-footer-text">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Register;
