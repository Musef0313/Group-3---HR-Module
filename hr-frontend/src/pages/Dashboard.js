import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/leaves");
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filters
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const rejectedLeaves = leaves.filter((l) => l.status === "REJECTED");

  const total = leaves.length;
  const pendingPercent = total ? ((pendingLeaves.length / total) * 100).toFixed(1) : 0;
  const approvedPercent = total ? ((approvedLeaves.length / total) * 100).toFixed(1) : 0;
  const rejectedPercent = total ? ((rejectedLeaves.length / total) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard-wrapper">
      {/* Overlay */}
      <div className="overlay"></div>

      <div className="dashboard-content">
        <h1 className="hacker-heading"> HRMS Dashboard </h1>
        <p className="hacker-sub">Live Leave Status Monitor</p>

        <div className="cards-grid">
          <div
            className="card-widget pending clickable"
            onClick={() => navigate("/leaves")}
          >
            <h3>Pending</h3>
            <p className="count">{pendingLeaves.length} / {total}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${pendingPercent}%`, background: "#ffeb3b" }}
              ></div>
            </div>
            <p className="percent">{pendingPercent}%</p>
          </div>

          <div className="card-widget approved">
            <h3>Approved</h3>
            <p className="count">{approvedLeaves.length} / {total}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${approvedPercent}%`, background: "#4caf50" }}
              ></div>
            </div>
            <p className="percent">{approvedPercent}%</p>
          </div>

          <div className="card-widget rejected">
            <h3>Rejected</h3>
            <p className="count">{rejectedLeaves.length} / {total}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${rejectedPercent}%`, background: "#f44336" }}
              ></div>
            </div>
            <p className="percent">{rejectedPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
