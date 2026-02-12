import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ onLogout }) {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>HR Portal</h2>
        <nav>
          <Link to="/">🏠 Dashboard</Link>
          <Link to="/employees">👨‍💼 Employees</Link>
          <Link to="/departments">🏢 Departments</Link>
          <Link to="/payroll">💰 Payroll</Link>
          <Link to="/leave">📅 Leave</Link>
          <Link to="/recruitment">📝 Recruitment</Link>
          <Link to="/attendance">⏰ Attendance</Link>
          <Link to="/reports">📊 Reports</Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="content-area">
        <Header onLogout={onLogout} />
        <main className="main-content">
          {/* ✅ Yaha children ki jagah Outlet use hoga */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
