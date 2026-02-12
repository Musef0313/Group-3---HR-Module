import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Payroll.css";

const API_PAYROLL = "http://localhost:8090/api/payroll";
const API_EMP = "http://localhost:8080/api/employees";
const API_ATT = "http://localhost:8084/api/attendance";

export default function Payroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ basicSalary: "", allowances: "", deductions: "" });

  // Fetch all payrolls
  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_PAYROLL);
      const data = await res.json();
      setPayrolls(data);
    } catch (err) {
      toast.error("Error fetching payrolls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  // Fetch employee & attendance
  const fetchDetails = async () => {
    if (!employeeId) return toast.warning("Enter Employee ID");

    try {
      setLoading(true);

      const empRes = await fetch(`${API_EMP}/${employeeId}`);
      const empData = await empRes.json();

      if (!empData.data) {
        setEmployee(null);
        setAttendance(null);
        return toast.error("Employee not found");
      }
      setEmployee(empData.data);

      const attRes = await fetch(`${API_ATT}/${employeeId}`);
      const attData = await attRes.json();
      setAttendance(attData.data || null);
    } catch (err) {
      toast.error("Error fetching details");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit payroll
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employee) return toast.warning("Fetch employee first");

    try {
      const payload = { ...form, employeeId: employee.id };
      await fetch(API_PAYROLL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Payroll generated");
      setForm({ basicSalary: "", allowances: "", deductions: "" });
      fetchPayrolls();
    } catch (err) {
      toast.error("Error generating payroll");
    }
  };

  // Net salary auto-calc
  const netSalary = () => {
    const { basicSalary, allowances, deductions } = form;
    return Number(basicSalary || 0) + Number(allowances || 0) - Number(deductions || 0);
  };

  return (
    <div className="payroll-dashboard">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="overlay">
        <div className="container py-4">
          <h2 className="text-center text-white mb-4">Advanced Payroll Dashboard</h2>

          {/* Employee Search */}
          <div className="d-flex gap-2 mb-4 justify-content-center">
            <input
              type="number"
              className="form-control w-25"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={fetchDetails}>
              Fetch Details
            </button>
          </div>

          {/* Employee & Attendance Cards */}
          {loading && <div className="spinner-border text-light mb-3" role="status"><span className="visually-hidden">Loading...</span></div>}

          <div className="row mb-4">
            {employee && (
              <div className="col-md-6 mb-3">
                <div className="card shadow-lg info-card">
                  <div className="card-body">
                    <h5 className="card-title">Employee Details</h5>
                    <p><b>ID:</b> {employee.id}</p>
                    <p><b>Name:</b> {employee.name}</p>
                    <p><b>Email:</b> {employee.email}</p>
                    <p><b>Department:</b> {employee.department}</p>
                    <p><b>Designation:</b> {employee.designation}</p>
                  </div>
                </div>
              </div>
            )}

            {attendance && (
              <div className="col-md-6 mb-3">
                <div className="card shadow-lg info-card">
                  <div className="card-body">
                    <h5 className="card-title">Attendance</h5>
                    <p><b>Total Days:</b> {attendance.totalDays}</p>
                    <p><b>Present:</b> {attendance.presentDays}</p>
                    <p><b>Absent:</b> {attendance.absentDays}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payroll Form */}
          {employee && attendance && (
            <form className="card shadow-lg p-3 mb-4 payroll-form bg-light" onSubmit={handleSubmit}>
              <h5 className="mb-3">Generate Payroll</h5>
              <div className="row g-2">
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    name="basicSalary"
                    placeholder="Basic Salary"
                    value={form.basicSalary}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    name="allowances"
                    placeholder="Allowances"
                    value={form.allowances}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    name="deductions"
                    placeholder="Deductions"
                    value={form.deductions}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="mt-2 fw-bold">Net Salary: ₹ {netSalary()}</p>
              <button className="btn btn-success mt-2">Generate Payroll</button>
            </form>
          )}

          {/* Payroll Table */}
          <div className="card shadow-lg payroll-table-card">
            <table className="table table-hover table-bordered text-center mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Emp ID</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.length ? payrolls.map(p => (
                  <tr key={p.id}>
                    <td>{p.employeeId}</td>
                    <td>₹ {p.basicSalary}</td>
                    <td>₹ {p.allowances}</td>
                    <td>₹ {p.deductions}</td>
                    <td className="fw-bold text-success">₹ {Number(p.basicSalary) + Number(p.allowances) - Number(p.deductions)}</td>
                  </tr>
                )) : <tr><td colSpan="5">No Payrolls Found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
