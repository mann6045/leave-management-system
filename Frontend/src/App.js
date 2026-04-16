import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth pages ────────────────────────────────────────────────────────────
import Login    from "./pages/Login";
import Register from "./pages/Register";

// ── Employee pages ────────────────────────────────────────────────────────
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave        from "./pages/ApplyLeave";
import LeaveHistory      from "./pages/LeaveHistory";
import LeaveCalendar     from "./pages/LeaveCalendar";

// ── Manager pages ─────────────────────────────────────────────────────────
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerPanel     from "./pages/ManagerPanel";
import ManageLeaveBalance from "./pages/ManageLeaveBalance";
import ManagerCalendar from "./pages/ManagerCalendar";


// ── Admin pages ───────────────────────────────────────────────────────────
import AdminDashboard from "./pages/AdminDashboard";
import AllLeaves      from "./pages/AllLeaves";
import AdminLeaveBalance from "./pages/AdminLeaveBalance";

// ── Shared pages ──────────────────────────────────────────────────────────
import ManageUsers from "./pages/ManageUsers";
import Profile     from "./pages/Profile";

// ── Layout & routing ──────────────────────────────────────────────────────
import ProtectedRoute from "./routes/ProtectedRoute";
import Footer         from "./components/Footer";

// ─────────────────────────────────────────────────────────────────────────
// Layout wrapper — wraps every protected page with a sticky Footer
// Navbar is already inside each page component, so we only add Footer here
// ─────────────────────────────────────────────────────────────────────────
function PageLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Default redirect ──────────────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public routes (no footer needed) ─────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* EMPLOYEE routes                                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <PageLayout><EmployeeDashboard /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <PageLayout><ApplyLeave /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <PageLayout><LeaveHistory /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <PageLayout><LeaveCalendar /></PageLayout>
            </ProtectedRoute>
          }
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MANAGER routes                                                */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="MANAGER">
              <PageLayout><ManagerDashboard /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/panel"
          element={
            <ProtectedRoute role="MANAGER">
              <PageLayout><ManagerPanel /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/users"
          element={
            <ProtectedRoute role="MANAGER">
              <PageLayout><ManageUsers /></PageLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/manager/balance" 
          element={<ManageLeaveBalance />}
        />

        <Route 
          path="/manager/calendar" 
          element={<ManagerCalendar />} 
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ADMIN routes                                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <PageLayout><AdminDashboard /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <PageLayout><ManageUsers /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute role="ADMIN">
              <PageLayout><AllLeaves /></PageLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/balance" 
          element={<AdminLeaveBalance />} 
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SHARED routes (any authenticated role)                        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageLayout><Profile /></PageLayout>
            </ProtectedRoute>
          }
        />

        {/* ── 404 fallback ─────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
