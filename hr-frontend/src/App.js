import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Payroll from "./pages/Payroll";
import Leave from "./pages/Leave";
import Recruitment from "./pages/Recruitment";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Routes>
      {/* ✅ Layout as parent route */}
      <Route element={<Layout onLogout={() => setIsAuthenticated(false)} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
