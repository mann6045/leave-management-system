import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mu-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.mu-body {
  padding: 36px 40px;
  max-width: 1280px;
  margin: 0 auto;
}

.mu-page-header { margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
.mu-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.mu-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

/* Form card */
.mu-form-card {
  background: #fff;
  border-radius: 18px;
  padding: 28px 28px 24px;
  border: 1px solid rgba(99,102,241,0.09);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  margin-bottom: 24px;
  animation: fadeUp 0.42s ease both;
}
.mu-form-title {
  font-size: 15px; font-weight: 700; color: #1e1b4b;
  margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
}
.mu-form-title-badge {
  font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 100px; background: #fef3c7; color: #92400e;
}

.mu-form-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: 14px;
  align-items: flex-end;
}

.mu-field { display: flex; flex-direction: column; gap: 7px; }
.mu-label {
  font-size: 11px; font-weight: 700; color: #6b7280;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.mu-input, .mu-select {
  background: #f8f9ff; border: 1.5px solid #e5e7eb;
  border-radius: 11px; padding: 11px 14px;
  font-size: 14px; color: #1e1b4b;
  outline: none; font-family: inherit; font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box; width: 100%;
}
.mu-input::placeholder { color: #d1d5db; font-weight: 400; }
.mu-input:focus, .mu-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.mu-select {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
  background-color: #f8f9ff;
}
.mu-select:disabled { opacity: 0.55; cursor: not-allowed; }

.mu-form-actions { display: flex; gap: 8px; }
.mu-submit-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 11px 22px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; cursor: pointer;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: all 0.18s; white-space: nowrap;
}
.mu-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }
.mu-submit-btn.update {
  background: linear-gradient(135deg, #b45309, #f59e0b);
  box-shadow: 0 4px 12px rgba(245,158,11,0.3);
}
.mu-reset-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 11px 16px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; background: #fff;
  color: #6b7280; cursor: pointer; transition: all 0.18s;
}
.mu-reset-btn:hover { background: #f3f4f6; }

/* Users table section */
.mu-section {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  animation: fadeUp 0.48s ease both;
}
.mu-section-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
}
.mu-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; }
.mu-count { font-size: 12px; font-weight: 700; color: #6366f1; background: #ede9fe; padding: 3px 10px; border-radius: 100px; }

.mu-table { width: 100%; border-collapse: collapse; }
.mu-table thead tr { border-bottom: 1px solid #f3f4f6; }
.mu-table thead th {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9ca3af; padding: 10px 14px; text-align: left;
}
.mu-table tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
.mu-table tbody tr:last-child { border-bottom: none; }
.mu-table tbody tr:hover { background: #fafbff; }
.mu-table td { padding: 13px 14px; font-size: 14px; color: #374151; font-weight: 500; }

.mu-role {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 100px; letter-spacing: 0.05em;
}
.mu-role.ADMIN    { background: #f5f3ff; color: #6d28d9; }
.mu-role.MANAGER  { background: #f0fdf4; color: #065f46; }
.mu-role.EMPLOYEE { background: #eff6ff; color: #1d4ed8; }

.mu-edit-btn, .mu-delete-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.18s;
}
.mu-edit-btn {
  background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; margin-right: 8px;
}
.mu-edit-btn:hover { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.mu-delete-btn {
  background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5;
}
.mu-delete-btn:hover:not(:disabled) { background: #dc2626; color: #fff; border-color: #dc2626; }
.mu-delete-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.mu-empty { text-align: center; color: #9ca3af; padding: 40px; font-size: 14px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

function ManageUsers() {
  const [users, setUsers]           = useState([]);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole]             = useState("EMPLOYEE");
  const [editId, setEditId]         = useState(null);

  const loggedRole = localStorage.getItem("role");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/admin/users");
      if (loggedRole === "MANAGER") {
        setUsers(res.data.filter(u => u.role === "EMPLOYEE"));
      } else {
        setUsers(res.data);
      }
    } catch (err) { console.error(err); }
  }, [loggedRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const validateForm = () => {
    if (!name || !email) { alert("Name and Email are required"); return false; }
    if (!editId && !password) { alert("Password required for new user"); return false; }
    if (!department) { alert("Department required"); return false; }
    return true;
  };

  const createUser = async () => {
    if (!validateForm()) return;
    try {
      await API.post("/admin/users", { name, email: email.toLowerCase(), password, department, role });
      fetchUsers(); resetForm();
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id, userRole) => {
    if (userRole === "ADMIN") { alert("Admin cannot be deleted"); return; }
    if (!window.confirm("Delete this user?")) return;
    try { await API.delete("/admin/users/" + id); fetchUsers(); } catch (err) { console.error(err); }
  };

  const editUser = (user) => {
    setEditId(user.id); setName(user.name); setEmail(user.email);
    setDepartment(user.department || ""); setRole(user.role);
  };

  const updateUser = async () => {
    if (!validateForm()) return;
    try {
      await API.put("/admin/users/" + editId, { name, email: email.toLowerCase(), password, department, role });
      setEditId(null); fetchUsers(); resetForm();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => { setName(""); setEmail(""); setPassword(""); setDepartment(""); setRole("EMPLOYEE"); setEditId(null); };

  return (
    <>
      <style>{css}</style>
      <div className="mu-root">
        <Navbar />
        <div className="mu-body">

          <div className="mu-page-header">
            <div className="mu-page-title">Manage Users</div>
            <div className="mu-page-sub">Create, edit, and remove user accounts</div>
          </div>

          {/* Form */}
          <div className="mu-form-card">
            <div className="mu-form-title">
              {editId ? (
                <><span>Update User</span><span className="mu-form-title-badge">Editing ID #{editId}</span></>
              ) : "➕ Create New User"}
            </div>
            <div className="mu-form-grid">
              <div className="mu-field">
                <label className="mu-label">Full Name</label>
                <input className="mu-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mu-field">
                <label className="mu-label">Email</label>
                <input className="mu-input" type="email" placeholder="john@co.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mu-field">
                <label className="mu-label">Password</label>
                <input className="mu-input" type="password" placeholder={editId ? "Leave blank to keep" : "••••••"} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mu-field">
                <label className="mu-label">Department</label>
                <select className="mu-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Select dept.</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="FINANCE">Finance</option>
                  <option value="SALES">Sales</option>
                </select>
              </div>
              <div className="mu-field">
                <label className="mu-label">Role</label>
                <select className="mu-select" value={role} onChange={(e) => setRole(e.target.value)} disabled={loggedRole === "MANAGER"}>
                  <option value="EMPLOYEE">Employee</option>
                  {loggedRole === "ADMIN" && <option value="MANAGER">Manager</option>}
                </select>
              </div>
              <div className="mu-form-actions">
                {editId ? (
                  <>
                    <button className="mu-submit-btn update" onClick={updateUser}>Update</button>
                    <button className="mu-reset-btn" onClick={resetForm}>✕</button>
                  </>
                ) : (
                  <button className="mu-submit-btn" onClick={createUser}>Create →</button>
                )}
              </div>
            </div>
          </div>

          {/* Users table */}
          <div className="mu-section">
            <div className="mu-section-header">
              <div className="mu-section-title">User List</div>
              <div className="mu-count">{users.length} users</div>
            </div>
            <table className="mu-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="mu-empty">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ fontWeight: 700, color: "#1e1b4b" }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.department}</td>
                    <td><span className={`mu-role ${u.role}`}>{u.role}</span></td>
                    <td>
                      <button className="mu-edit-btn" onClick={() => editUser(u)}>✏ Edit</button>
                      <button className="mu-delete-btn" disabled={u.role === "ADMIN"} onClick={() => deleteUser(u.id, u.role)}>
                        🗑 Delete
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

export default ManageUsers;
