// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import {
//   PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend
// } from "recharts";

// /**
//  * RecruitmentDashboardAdvanced.jsx
//  * Single-file SPA Dashboard with:
//  * - Left Sidebar navigation
//  * - Header with Dark/Light toggle
//  * - Jobs / Candidates / Interview / Offer sections (single page - tabs)
//  * - Analytics area: Stat cards, Pie (status), Bar (jobs by dept), Line (interviews by month)
//  *
//  * Notes:
//  * - Uses Tailwind classes. Ensure Tailwind JIT is configured and `darkMode: 'class'` is set in tailwind.config.
//  * - Installs: axios, recharts
//  */

// const API_BASE = "http://localhost:8085/api"; // change if required

// const COLORS = ["#4c6fff", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// export default function RecruitmentDashboardAdvanced() {
//   const [tab, setTab] = useState("dashboard"); // default show analytics dashboard
//   const [jobs, setJobs] = useState([]);
//   const [candidates, setCandidates] = useState([]);
//   const [interviews, setInterviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Theme (dark/light)
//   const [dark, setDark] = useState(() => {
//     try { return localStorage.getItem("rd_theme") === "dark"; } catch(e){ return false; }
//   });
//   useEffect(() => {
//     const root = document.documentElement;
//     if (dark) root.classList.add("dark"); else root.classList.remove("dark");
//     try { localStorage.setItem("rd_theme", dark ? "dark" : "light"); } catch(e){}
//   }, [dark]);

//   // Fetch data (with graceful fallback to mock)
//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);

//     Promise.allSettled([
//       axios.get(`${API_BASE}/jobs`),
//       axios.get(`${API_BASE}/candidates`),
//       axios.get(`${API_BASE}/interviews`)
//     ]).then(results => {
//       if (!mounted) return;
//       // jobs
//       if (results[0].status === "fulfilled" && Array.isArray(results[0].value.data)) {
//         setJobs(results[0].value.data);
//       } else {
//         setJobs(mockJobs());
//       }

//       // candidates
//       if (results[1].status === "fulfilled" && Array.isArray(results[1].value.data)) {
//         setCandidates(results[1].value.data);
//       } else {
//         setCandidates(mockCandidates());
//       }

//       // interviews
//       if (results[2].status === "fulfilled" && Array.isArray(results[2].value.data)) {
//         setInterviews(results[2].value.data);
//       } else {
//         setInterviews(mockInterviews());
//       }

//       setLoading(false);
//     }).catch(() => {
//       // fallback if something unexpected
//       setJobs(mockJobs());
//       setCandidates(mockCandidates());
//       setInterviews(mockInterviews());
//       setLoading(false);
//     });

//     return () => { mounted = false; };
//   }, []);

//   // Derived metrics
//   const metrics = useMemo(() => {
//     const totalJobs = jobs.length;
//     const totalCandidates = candidates.length;
//     const totalInterviews = interviews.length;

//     // candidate statuses, normalize keys
//     const statusCounts = candidates.reduce((acc, c) => {
//       const st = (c.status || "New").toLowerCase();
//       acc[st] = (acc[st] || 0) + 1;
//       return acc;
//     }, {});

//     // jobs by department (assume job.department or fallback to job.title categories)
//     const jobsByDept = jobs.reduce((acc, j) => {
//       const dept = (j.department || inferDeptFromTitle(j.title) || "General");
//       acc[dept] = (acc[dept] || 0) + 1;
//       return acc;
//     }, {});

//     // Interviews by month (last 6 months)
//     const interviewsByMonth = getInterviewsByMonth(interviews, 6);

//     return { totalJobs, totalCandidates, totalInterviews, statusCounts, jobsByDept, interviewsByMonth };
//   }, [jobs, candidates, interviews]);

//   // Prepare chart data
//   const pieData = useMemo(() => {
//     // top statuses: selected, interviewed, rejected, on-hold, new
//     const keys = ["selected", "interviewed", "rejected", "on-hold", "new"];
//     return keys.map((k, i) => ({ name: capitalize(k), value: metrics.statusCounts[k] || 0, color: COLORS[i % COLORS.length] }));
//   }, [metrics.statusCounts]);

//   const barData = useMemo(() => {
//     return Object.entries(metrics.jobsByDept).map(([name, count]) => ({ name, count }));
//   }, [metrics.jobsByDept]);

//   const lineData = useMemo(() => {
//     // interviewsByMonth { "2025-07": 5, ... } -> array sorted
//     return metrics.interviewsByMonth.map(d => ({ month: d.monthLabel, interviews: d.count }));
//   }, [metrics.interviewsByMonth]);

//   // Basic UI components inside file for convenience
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
//       <div className="flex">

//         {/* SIDEBAR */}
//         <aside className="w-72 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">HR Recruit</h1>
//               <p className="text-sm text-gray-500 dark:text-gray-300">Talent & Hiring</p>
//             </div>
//             <button
//               onClick={() => setDark(d => !d)}
//               aria-label="Toggle theme"
//               className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
//             >
//               {dark ? "🌙" : "☀️"}
//             </button>
//           </div>

//           <nav className="space-y-2">
//             <NavButton label="Dashboard" active={tab==="dashboard"} onClick={()=>setTab("dashboard")} />
//             <NavButton label="Jobs" active={tab==="jobs"} onClick={()=>setTab("jobs")} />
//             <NavButton label="Candidates" active={tab==="candidates"} onClick={()=>setTab("candidates")} />
//             <NavButton label="Interviews" active={tab==="interviews"} onClick={()=>setTab("interviews")} />
//             <NavButton label="Offer Letter" active={tab==="offer"} onClick={()=>setTab("offer")} />
//           </nav>

//           <div className="mt-8 text-sm text-gray-500 dark:text-gray-300">
//             <p className="font-medium">Quick stats</p>
//             <ul className="mt-2 space-y-1">
//               <li>Total Jobs: <strong>{metrics.totalJobs}</strong></li>
//               <li>Total Candidates: <strong>{metrics.totalCandidates}</strong></li>
//               <li>Total Interviews: <strong>{metrics.totalInterviews}</strong></li>
//             </ul>
//           </div>
//         </aside>

//         {/* MAIN */}
//         <main className="flex-1 p-8">
//           {/* Header */}
//           <header className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold">{tab === "dashboard" ? "Dashboard" : capitalize(tab)}</h2>
//             <div className="text-sm text-gray-600 dark:text-gray-300">
//               {loading ? "Loading…" : `Updated: ${new Date().toLocaleString()}`}
//             </div>
//           </header>

//           {/* CONTENT: Dashboard or Section */}
//           {tab === "dashboard" ? (
//             <div className="space-y-6">
//               {/* Stat cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <StatCard title="Total Jobs" value={metrics.totalJobs} icon="📋" />
//                 <StatCard title="Candidates" value={metrics.totalCandidates} icon="👥" />
//                 <StatCard title="Interviews" value={metrics.totalInterviews} icon="⏱️" />
//                 <StatCard title="Open Roles" value={Math.max(0, metrics.totalJobs - (metrics.totalInterviews||0))} icon="🚀" />
//               </div>

//               {/* Charts Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Pie - Status */}
//                 <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Candidate Status</h3>
//                   <div style={{ height: 260 }}>
//                     <ResponsiveContainer>
//                       <PieChart>
//                         <Pie dataKey="value" data={pieData} innerRadius={50} outerRadius={80} paddingAngle={6}>
//                           {pieData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <ReTooltip formatter={(value, name) => [`${value}`, name]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </section>

//                 {/* Bar - Jobs by Dept */}
//                 <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Jobs by Department</h3>
//                   <div style={{ height: 260 }}>
//                     <ResponsiveContainer>
//                       <BarChart data={barData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                         <YAxis />
//                         <ReTooltip />
//                         <Bar dataKey="count" fill="#4c6fff" radius={[6,6,0,0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </section>

//                 {/* Line - Interviews by Month */}
//                 <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Interviews (last 6 months)</h3>
//                   <div style={{ height: 260 }}>
//                     <ResponsiveContainer>
//                       <LineChart data={lineData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <ReTooltip />
//                         <Legend />
//                         <Line type="monotone" dataKey="interviews" stroke="#00C49F" strokeWidth={3} />
//                         <Line type="monotone" dataKey="cumulative" stroke="#8884d8" strokeWidth={2} strokeDasharray="5 5" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </section>
//               </div>

//               {/* Quick lists: recent jobs & candidates */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-3">Recent Jobs</h3>
//                   <ul className="space-y-3">
//                     {jobs.slice(0,6).map(j => (
//                       <li key={j.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
//                         <div>
//                           <div className="font-medium">{j.title}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-300">{j.location} • {j.department || "General"}</div>
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-300">{j.exp ? `${j.exp} yrs` : "-"}</div>
//                       </li>
//                     ))}
//                     {jobs.length === 0 && <li className="text-sm text-gray-500">No jobs found</li>}
//                   </ul>
//                 </section>

//                 <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-3">Recent Candidates</h3>
//                   <ul className="space-y-3">
//                     {candidates.slice(0,6).map(c => (
//                       <li key={c.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
//                         <div>
//                           <div className="font-medium">{c.name}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-300">{c.email}</div>
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-300">{capitalize(c.status || "New")}</div>
//                       </li>
//                     ))}
//                     {candidates.length === 0 && <li className="text-sm text-gray-500">No candidates found</li>}
//                   </ul>
//                 </section>
//               </div>
//             </div>
//           ) : (
//             // If not dashboard, render simple sections (Jobs/Candidates/Interviews/Offer)
//             <SectionTabs
//               tab={tab}
//               jobs={jobs}
//               candidates={candidates}
//               interviews={interviews}
//               onBack={() => setTab("dashboard")}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- small helper components ---------- */

// function NavButton({ label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full text-left px-3 py-2 rounded-md transition flex items-center justify-between
//         ${active ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
//     >
//       <span className="capitalize">{label}</span>
//       {active && <span className="text-sm opacity-90">●</span>}
//     </button>
//   );
// }

// function StatCard({ title, value, icon }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center justify-between">
//       <div>
//         <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
//         <div className="text-2xl font-semibold">{value}</div>
//       </div>
//       <div className="text-3xl">{icon}</div>
//     </div>
//   );
// }

// function SectionTabs({ tab, jobs, candidates, interviews, onBack }) {
//   if (tab === "jobs") {
//     return (
//       <div>
//         <button onClick={onBack} className="mb-4 text-sm text-blue-600">← Back to Dashboard</button>
//         <h3 className="text-xl font-semibold mb-3">Jobs</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {jobs.map(j => (
//             <div key={j.id} className="p-4 rounded bg-white dark:bg-gray-800 shadow">
//               <div className="font-medium text-lg">{j.title}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-300">{j.location} • {j.department || "General"}</div>
//               <div className="mt-2 text-sm">Experience: {j.exp || "-"}</div>
//             </div>
//           ))}
//           {jobs.length === 0 && <div className="text-sm">No jobs available</div>}
//         </div>
//       </div>
//     );
//   }

//   if (tab === "candidates") {
//     return (
//       <div>
//         <button onClick={onBack} className="mb-4 text-sm text-blue-600">← Back to Dashboard</button>
//         <h3 className="text-xl font-semibold mb-3">Candidates</h3>
//         <div className="space-y-3">
//           {candidates.map(c => (
//             <div key={c.id} className="p-4 rounded bg-white dark:bg-gray-800 shadow flex justify-between items-center">
//               <div>
//                 <div className="font-medium">{c.name}</div>
//                 <div className="text-sm text-gray-500 dark:text-gray-300">{c.email}</div>
//               </div>
//               <div className="text-sm">{capitalize(c.status || "New")}</div>
//             </div>
//           ))}
//           {candidates.length === 0 && <div className="text-sm">No candidates</div>}
//         </div>
//       </div>
//     );
//   }

//   if (tab === "interviews") {
//     return (
//       <div>
//         <button onClick={onBack} className="mb-4 text-sm text-blue-600">← Back to Dashboard</button>
//         <h3 className="text-xl font-semibold mb-3">Interviews</h3>
//         <div className="space-y-3">
//           {interviews.map(i => (
//             <div key={i.id || `${i.candidateId}-${i.date}`} className="p-4 rounded bg-white dark:bg-gray-800 shadow flex justify-between items-center">
//               <div>
//                 <div className="font-medium">Candidate: {i.candidateName || i.candidateId}</div>
//                 <div className="text-sm text-gray-500 dark:text-gray-300">{i.date} {i.time || ""}</div>
//               </div>
//               <div className="text-sm">{i.round || "-"}</div>
//             </div>
//           ))}
//           {interviews.length === 0 && <div className="text-sm">No interviews scheduled</div>}
//         </div>
//       </div>
//     );
//   }

//   if (tab === "offer") {
//     return (
//       <div>
//         <button onClick={onBack} className="mb-4 text-sm text-blue-600">← Back to Dashboard</button>
//         <h3 className="text-xl font-semibold mb-3">Offer Letter Generator</h3>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
//           <p className="text-sm text-gray-400">Use this section to fill candidate details and generate offer letter PDF (you can integrate a PDF library or backend route to produce PDF).</p>
//           {/* Minimal form placeholder */}
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
//             <input className="p-2 border rounded" placeholder="Candidate Name" />
//             <input className="p-2 border rounded" placeholder="Salary" />
//             <input className="p-2 border rounded" type="date" />
//             <button className="col-span-full bg-blue-600 text-white p-2 rounded">Generate PDF</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }

// /* ---------- utilities & mocks ---------- */

// function capitalize(s="") { return s && s[0].toUpperCase() + s.slice(1); }

// function inferDeptFromTitle(title="") {
//   const t = (title || "").toLowerCase();
//   if (!t) return null;
//   if (t.includes("engineer") || t.includes("developer")) return "Engineering";
//   if (t.includes("hr") || t.includes("recruit")) return "People";
//   if (t.includes("marketing")) return "Marketing";
//   if (t.includes("sales")) return "Sales";
//   if (t.includes("design")) return "Design";
//   return null;
// }

// function getInterviewsByMonth(interviews = [], months = 6) {
//   // Populate last `months` months counting from now, return array with { monthKey: '2025-07', monthLabel: 'Jul 25', count: X }
//   const now = new Date();
//   const res = [];
//   for (let i = months-1; i >= 0; i--) {
//     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
//     res.push({ key, monthLabel: d.toLocaleString(undefined, { month: "short", year: "2-digit" }), count: 0 });
//   }
//   const map = Object.fromEntries(res.map(r => [r.key, r]));
//   interviews.forEach(inv => {
//     const dateStr = inv.date || inv.scheduledDate || inv.datetime; // accept various fields
//     if (!dateStr) return;
//     const dt = new Date(dateStr);
//     if (isNaN(dt)) return;
//     const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
//     if (map[key]) map[key].count++;
//   });
//   // Add cumulative values for second line
//   let running = 0;
//   return res.map(r => {
//     running += r.count;
//     return { ...r, cumulative: running, monthLabel: r.monthLabel };
//   });
// }

// /* ---------- MOCK DATA (fallback) ---------- */

// function mockJobs() {
//   return [
//     { id: 1, title: "Frontend Developer", location: "Mumbai", exp: 2, department: "Engineering" },
//     { id: 2, title: "Backend Engineer", location: "Remote", exp: 3, department: "Engineering" },
//     { id: 3, title: "HR Recruiter", location: "Delhi", exp: 1, department: "People" },
//     { id: 4, title: "Product Designer", location: "Bengaluru", exp: 4, department: "Design" },
//     { id: 5, title: "Sales Executive", location: "Hyderabad", exp: 2, department: "Sales" },
//   ];
// }

// function mockCandidates() {
//   return [
//     { id: "c1", name: "Aisha Khan", email: "aisha@example.com", status: "new" },
//     { id: "c2", name: "Rohit Verma", email: "rohit@example.com", status: "interviewed" },
//     { id: "c3", name: "Sunita Rao", email: "sunita@example.com", status: "selected" },
//     { id: "c4", name: "Vikram Singh", email: "vikram@example.com", status: "rejected" },
//     { id: "c5", name: "Neha Gupta", email: "neha@example.com", status: "on-hold" },
//   ];
// }

// function mockInterviews() {
//   const now = new Date();
//   const list = [];
//   for (let i = 0; i < 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() - Math.floor(Math.random()*6), Math.ceil(Math.random()*25));
//     list.push({
//       id: `iv-${i}`,
//       candidateId: `c${(i%5)+1}`,
//       candidateName: ["Aisha","Rohit","Sunita","Vikram","Neha"][i%5],
//       date: d.toISOString().split("T")[0],
//       time: `${9 + (i%8)}:00`,
//       round: ["Phone","Technical","HR"][i%3]
//     });
//   }
//   return list;
// }