import React, { useState, useEffect } from 'react';
import './Attendance.css';

const API_ATTENDANCE = "http://localhost:8084/api/attendance";
const API_EMPLOYEE = "http://localhost:8080/api/employees";

export default function Attendance() {

  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [attendanceList, setAttendanceList] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Fetch Employee Details
  const fetchEmployee = () => {
    if (!employeeId) return;

    fetch(`${API_EMPLOYEE}/${employeeId}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setEmployeeDetails(res.data);
        } else {
          setEmployeeDetails(null);
          alert("Employee Not Found");
        }
      })
      .catch(() => alert("API Error: Employee Service Down"));
  };

  // Mark Attendance
  const markAttendance = () => {
    if (!employeeId) {
      alert("Enter Employee ID");
      return;
    }

    const data = {
      employeeId: parseInt(employeeId),
      status: status
    };

    fetch(API_ATTENDANCE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(() => {
        alert("Attendance Marked");
        fetchAll();
      })
      .catch(() => alert("Error marking attendance"));
  };

  // Fetch All Attendance
  const fetchAll = () => {
    fetch(API_ATTENDANCE)
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) {
          setAttendanceList(res);
        } else if (res.data) {
          setAttendanceList(res.data);
        } else {
          setAttendanceList([]);
        }
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="attendance-container">

      <h2>Mark Attendance</h2>

      <input
        type="number"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={e => setEmployeeId(e.target.value)}
        onBlur={fetchEmployee}
      />

      {employeeDetails && (
        <div className="employee-card">
          <p><b>Name:</b> {employeeDetails.name}</p>
          <p><b>Email:</b> {employeeDetails.email}</p>
          <p><b>Department:</b> {employeeDetails.department}</p>
          <p><b>Designation:</b> {employeeDetails.designation}</p>
          <p><b>Salary:</b> {employeeDetails.salary}</p>
        </div>
      )}

      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="PRESENT">Present</option>
        <option value="ABSENT">Absent</option>
      </select>

      <button onClick={markAttendance}>Mark Attendance</button>

      <h2>Attendance List</h2>

      <table>
        <thead>
          <tr>
            <th>Seq ID</th>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendanceList.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.employeeId}</td>
              <td>{a.date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
  
}