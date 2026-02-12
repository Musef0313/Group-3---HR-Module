import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Employees.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    empCode: "",
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
  });

  // Fetch employees
  const fetchEmployees = () => {
    fetch("http://localhost:8080/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.data);   // FIXED
      })
      .catch((err) => console.log("Fetch Error:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Employee
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),  // FIXED KEYS
    })
      .then((res) => res.json())
      .then(() => {
        fetchEmployees();
        setShowForm(false);

        setForm({
          empCode: "",
          name: "",
          email: "",
          department: "",
          designation: "",
          salary: "",
        });
      })
      .catch((err) => console.log("Insert Error:", err));
  };

  // Delete employee
  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;

    fetch(`http://localhost:8080/api/employees/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchEmployees())
      .catch((err) => console.log("Delete Error:", err));
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-3 fw-bold">Employees Management</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "+ Add Employee"}
      </button>

      {/* Add Employee Form */}
      {showForm && (
        <form className="border rounded p-3 shadow mb-4" onSubmit={handleSubmit}>
          <div className="row g-2">

            <div className="col-md-4">
              <input name="empCode" className="form-control" placeholder="Employee Code"
                required value={form.empCode} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <input name="name" className="form-control" placeholder="Full Name"
                required value={form.name} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <input type="email" name="email" className="form-control" placeholder="Email"
                required value={form.email} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <input name="department" className="form-control" placeholder="Department"
                value={form.department} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <input name="designation" className="form-control" placeholder="Designation"
                value={form.designation} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <input type="number" name="salary" className="form-control" placeholder="Salary"
                value={form.salary} onChange={handleChange} />
            </div>

          </div>

          <button type="submit" className="btn btn-success mt-3">Save Employee</button>
        </form>
      )}

      {/* Employee Table */}
      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.empCode}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>₹ {emp.salary}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8" className="fw-bold text-muted">No Employees Found</td></tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
