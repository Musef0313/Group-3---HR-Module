import React, { useEffect, useState } from "react";
import "./leave.css";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [error, setError] = useState("");

  //  Date formatter (YYYY-MM-DD → YYYY/MM/DD for display)
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    } catch {
      return dateStr;
    }
  };

  //  Only allow YYYY-MM-DD format for backend compatibility
  const handleDateChange = (e) => {
    const val = e.target.value;
    setNewLeave({ ...newLeave, [e.target.name]: val });
  };

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

  // Handle text inputs
  const handleChange = (e) => {
    setNewLeave({ ...newLeave, [e.target.name]: e.target.value });
  };

  // Submit new leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newLeave.fromDate && newLeave.toDate) {
      if (newLeave.toDate < newLeave.fromDate) {
        setError(" To Date cannot be before From Date");
        return;
      }
    }

    setError("");

    try {
      const leaveRequest = {
        employeeId: newLeave.employeeId,
        fromDate: newLeave.fromDate, // YYYY-MM-DD
        toDate: newLeave.toDate,
        reason: newLeave.reason,
      };

      await fetch("http://localhost:8082/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveRequest),
      });

      setNewLeave({ employeeId: "", fromDate: "", toDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      console.error("Error adding leave:", err);
    }
  };

  // Approve leave
  const approveLeave = async (id) => {
    await fetch(`http://localhost:8082/api/leaves/${id}/approve`, {
      method: "PUT",
    });
    fetchLeaves();
  };

  // Reject leave
  const rejectLeave = async (id) => {
    await fetch(`http://localhost:8082/api/leaves/${id}/reject`, {
      method: "PUT",
    });
    fetchLeaves();
  };

  return (
    <div className="leave-container">
      <h2 className="heading">Leave Management</h2>

      {/* Leave Apply Form */}
      <form className="leave-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={newLeave.employeeId}
          onChange={handleChange}
          required
        />

        {/* HTML5 date input → automatically gives YYYY-MM-DD */}
        <input
          type="date"
          name="fromDate"
          value={newLeave.fromDate}
          onChange={handleDateChange}
          required
        />
        <input
          type="date"
          name="toDate"
          value={newLeave.toDate}
          onChange={handleDateChange}
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={newLeave.reason}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">
          Apply Leave
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Leave Table */}
      <table className="leave-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <tr
                key={leave.id}
                className={
                  leave.status === "APPROVED"
                    ? "row-approved"
                    : leave.status === "REJECTED"
                    ? "row-rejected"
                    : "row-pending"
                }
              >
                <td>{index + 1}</td>
                <td>{leave.employeeId}</td>
                <td>{formatDate(leave.fromDate)}</td>
                <td>{formatDate(leave.toDate)}</td>
                <td>{leave.reason}</td>
                <td>
                  <span
                    className={`status-badge ${leave.status?.toLowerCase()}`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => approveLeave(leave.id)}
                    disabled={leave.status !== "PENDING"}
                  >
                      Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => rejectLeave(leave.id)}
                    disabled={leave.status !== "PENDING"}
                  >
                     Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No leaves found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

