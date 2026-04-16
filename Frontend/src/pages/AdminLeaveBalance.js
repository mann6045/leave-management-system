import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const css = `
.admin-root {
  background: #f4f6ff;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.admin-body {
  padding: 30px;
  max-width: 1300px;
  margin: auto;
}
.admin-title {
  font-size: 26px;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 20px;
}

/* controls */
.admin-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.admin-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
}
.admin-btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
.admin-btn.primary {
  background: #6366f1;
  color: white;
}
.admin-btn.danger {
  background: #ef4444;
  color: white;
}

/* table */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}
.admin-table th {
  text-align: left;
  padding: 12px;
  background: #f3f4f6;
  font-size: 12px;
}
.admin-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f1f1;
}
`;

function AdminLeaveBalance() {

  const [balances, setBalances] = useState([]);
  const [search, setSearch] = useState("");

  const [editData, setEditData] = useState({
    employeeId: "",
    leaveType: "CASUAL",
    totalLeave: "",
    usedLeave: ""
  });

  // ================= FETCH =================
  const fetchBalances = async () => {
    try {
      const res = await API.get("/leaves/balance/all");
      setBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  // ================= UPDATE =================
  const updateBalance = async () => {
    try {
      await API.put("/leaves/balance/update", {
        ...editData,
        totalLeave: Number(editData.totalLeave),
        usedLeave: Number(editData.usedLeave)
      });

      alert("✅ Updated");
      fetchBalances();

    } catch (err) {
      console.error(err);
      alert("❌ Failed");
    }
  };

  // ================= DELETE =================
  const deleteBalance = async (empId, type) => {
    try {
      await API.delete(`/leaves/balance/delete?employeeId=${empId}&leaveType=${type}`);
      fetchBalances();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filtered = balances.filter(b =>
    b.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
    String(b.employeeId).includes(search)
  );

  return (
    <>
      <style>{css}</style>
      <div className="admin-root">
        <Navbar />

        <div className="admin-body">

          <div className="admin-title">Admin Leave Balance Panel</div>

          {/* SEARCH */}
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* EDIT FORM */}
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="Employee ID"
              value={editData.employeeId}
              onChange={(e) => setEditData({ ...editData, employeeId: e.target.value })}
            />

            <select
              className="admin-input"
              value={editData.leaveType}
              onChange={(e) => setEditData({ ...editData, leaveType: e.target.value })}
            >
              <option>CASUAL</option>
              <option>SICK</option>
              <option>PAID</option>
            </select>

            <input
              className="admin-input"
              placeholder="Total Leave"
              type="number"
              value={editData.totalLeave}
              onChange={(e) => setEditData({ ...editData, totalLeave: e.target.value })}
            />

            <input
              className="admin-input"
              placeholder="Used Leave"
              type="number"
              value={editData.usedLeave}
              onChange={(e) => setEditData({ ...editData, usedLeave: e.target.value })}
            />

            <button className="admin-btn primary" onClick={updateBalance}>
              Update
            </button>
          </div>

          {/* TABLE */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Type</th>
                <th>Total</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">No data</td>
                </tr>
              ) : filtered.map((b, i) => (
                <tr key={i}>
                  <td>{b.employeeName}</td>
                  <td>{b.employeeId}</td>
                  <td>{b.leaveType}</td>
                  <td>{b.totalLeave}</td>
                  <td>{b.usedLeave}</td>
                  <td>{b.remainingLeave}</td>
                  <td>
                    <button
                      className="admin-btn danger"
                      onClick={() => deleteBalance(b.employeeId, b.leaveType)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </>
  );
}

export default AdminLeaveBalance;