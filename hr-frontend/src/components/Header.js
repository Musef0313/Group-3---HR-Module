import React from "react";

export default function Header({ onLogout }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#2c3e50",
        color: "white",
      }}
    >
      <h2>Welcome HR</h2>

      {/* ✅ Logout button */}
      <button
        onClick={onLogout}
        style={{
          padding: "6px 12px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "red",
          color: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </header>
  );
}
