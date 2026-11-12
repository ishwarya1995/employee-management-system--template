import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialEmployees = [
  { id: 1, name: "Arun Kumar", email: "arun@gmail.com", phone: "9876543210", department: "IT", role: "Frontend Developer", status: "Active", joiningDate: "2025-01-15", salary: 35000 },
  { id: 2, name: "Priya", email: "priya@gmail.com", phone: "9876543211", department: "HR", role: "HR Executive", status: "Active", joiningDate: "2025-02-10", salary: 30000 },
  { id: 3, name: "Rahul Kumar", email: "rahul@gmail.com", phone: "9876543212", department: "Finance", role: "Accountant", status: "Active", joiningDate: "2024-11-20", salary: 32000 },
  { id: 4, name: "Sneha Devi", email: "sneha@gmail.com", phone: "9876543213", department: "Marketing", role: "Marketing Executive", status: "Inactive", joiningDate: "2024-08-12", salary: 28000 },
  { id: 5, name: "Karthik", email: "karthik@gmail.com", phone: "9876543214", department: "IT", role: "Backend Developer", status: "Active", joiningDate: "2025-04-05", salary: 40000 },
  { id: 6, name: "Divya", email: "divya@gmail.com", phone: "9876543215", department: "HR", role: "Recruiter", status: "Active", joiningDate: "2025-06-01", salary: 29000 },
  { id: 7, name: "Vijay Kumar", email: "vijay@gmail.com", phone: "9876543216", department: "Sales", role: "Sales Executive", status: "Active", joiningDate: "2025-07-10", salary: 27000 },
  { id: 8, name: "Meena", email: "meena@gmail.com", phone: "9876543217", department: "Finance", role: "Finance Analyst", status: "Inactive", joiningDate: "2024-09-15", salary: 33000 }
];

const initialLeaves = [
  { id: 1, name: "Priya", type: "Casual Leave", from: "2026-11-15", to: "2026-11-16", reason: "Personal work", status: "Pending" },
  { id: 2, name: "Arun Kumar", type: "Sick Leave", from: "2026-11-18", to: "2026-11-18", reason: "Not feeling well", status: "Pending" },
  { id: 3, name: "Rahul Kumar", type: "Annual Leave", from: "2026-11-20", to: "2026-11-22", reason: "Family function", status: "Approved" }
];

const initialDepartments = ["IT", "HR", "Finance", "Marketing", "Sales"];

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [employees, setEmployees] = useState(() =>
    readStorage("ems_employees", initialEmployees)
  );

  const [leaves, setLeaves] = useState(() =>
    readStorage("ems_leaves", initialLeaves)
  );

  const [departments, setDepartments] = useState(() =>
    readStorage("ems_departments", initialDepartments)
  );

  const [attendance, setAttendance] = useState(() =>
    readStorage("ems_attendance", {})
  );

  const [page, setPage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(() =>
    readStorage("ems_darkMode", false)
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const [modal, setModal] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [newDepartment, setNewDepartment] = useState("");

  const [profile, setProfile] = useState(() =>
    readStorage("ems_profile", {
      name: "Admin User",
      email: "admin@company.com",
      role: "Administrator"
    })
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "IT",
    role: "",
    status: "Active",
    joiningDate: "",
    salary: ""
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("ems_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("ems_leaves", JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem("ems_departments", JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem("ems_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("ems_darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("ems_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);

  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(e =>
        `${e.name} ${e.email} ${e.role} ${e.department}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter(e => filterDept === "All" || e.department === filterDept)
      .filter(e => filterStatus === "All" || e.status === filterStatus)
      .sort((a, b) =>
        String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""))
      );
  }, [employees, search, filterDept, filterStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDept, filterStatus, sortBy]);

  const openAdd = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      department: departments[0] || "",
      role: "",
      status: "Active",
      joiningDate: "",
      salary: ""
    });
    setSelectedEmployee(null);
    setModal("form");
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setForm({ ...employee });
    setModal("form");
  };

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setModal("view");
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      notify("Please fill all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      notify("Please enter a valid email address.");
      return;
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      notify("Phone number must contain 10 digits.");
      return;
    }

    if (selectedEmployee) {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === selectedEmployee.id
            ? { ...form, id: selectedEmployee.id, salary: Number(form.salary) || 0 }
            : emp
        )
      );
      notify("Employee updated successfully!");
    } else {
      setEmployees(prev => [
        ...prev,
        { ...form, id: Date.now(), salary: Number(form.salary) || 0 }
      ]);
      notify("Employee added successfully!");
    }

    setModal("");
  };

  const handleDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteId));
    setDeleteId(null);
    setModal("");
    notify("Employee deleted successfully!");
  };

  const updateLeave = (id, status) => {
    setLeaves(prev =>
      prev.map(l => l.id === id ? { ...l, status } : l)
    );
    notify(`Leave ${status.toLowerCase()} successfully!`);
  };

  const addDepartment = () => {
    const name = newDepartment.trim();
    if (!name) {
      notify("Enter department name.");
      return;
    }
    if (departments.some(d => d.toLowerCase() === name.toLowerCase())) {
      notify("Department already exists.");
      return;
    }
    setDepartments(prev => [...prev, name]);
    setNewDepartment("");
    notify("Department added!");
  };

  const deleteDepartment = (dept) => {
    if (employees.some(e => e.department === dept)) {
      notify("Cannot delete: employees are assigned to this department.");
      return;
    }
    if (window.confirm(`Delete ${dept} department?`)) {
      setDepartments(prev => prev.filter(d => d !== dept));
      notify("Department deleted!");
    }
  };

  const markAttendance = (id, status) => {
    const today = new Date().toISOString().slice(0, 10);
    setAttendance(prev => ({
      ...prev,
      [today]: {
        ...(prev[today] || {}),
        [id]: status
      }
    }));
    notify("Attendance updated!");
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance[today] || {};
  const presentCount = Object.values(todayAttendance).filter(v => v === "Present").length;
  const absentCount = Object.values(todayAttendance).filter(v => v === "Absent").length;

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Employees", icon: "♙" },
    { name: "Departments", icon: "▤" },
    { name: "Leave Requests", icon: "▣" },
    { name: "Attendance", icon: "◷" },
    { name: "Settings", icon: "⚙" }
  ];

  const changePage = (name) => {
    setPage(name);
    setSearch("");
    setCurrentPage(1);
  };

  const statusBadge = (status) => (
    <span className={`status-badge ${status.toLowerCase()}`}>
      {status}
    </span>
  );

  const renderDashboard = () => (
    <>
      <div className="welcome-row">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome back, {profile.name}! Here's what's happening today.</p>
        </div>
        <div className="date-label">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">♙</div>
          <div><p>Total Employees</p><h2>{employees.length}</h2><small>All registered employees</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div><p>Active Employees</p><h2>{activeEmployees}</h2><small>Currently working</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">▤</div>
          <div><p>Departments</p><h2>{departments.length}</h2><small>Active departments</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">◷</div>
          <div><p>Pending Leaves</p><h2>{pendingLeaves}</h2><small>Awaiting approval</small></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div><h3>Department Overview</h3><p>Employees by department</p></div>
            <button className="text-btn" onClick={() => changePage("Departments")}>View all</button>
          </div>
          {departments.map(dept => {
            const count = employees.filter(e => e.department === dept).length;
            const percentage = employees.length ? count / employees.length * 100 : 0;
            return (
              <div className="department-progress" key={dept}>
                <div className="progress-label"><span>{dept}</span><strong>{count}</strong></div>
                <div className="progress-track"><div style={{ width: `${percentage}%` }} /></div>
              </div>
            );
          })}
          {departments.length === 0 && <p className="empty-text">No departments available.</p>}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div><h3>Today's Attendance</h3><p>Attendance summary</p></div>
            <button className="text-btn" onClick={() => changePage("Attendance")}>View all</button>
          </div>
          <div className="attendance-summary">
            <div className="attendance-number green-text"><h2>{presentCount}</h2><span>Present</span></div>
            <div className="attendance-number red-text"><h2>{absentCount}</h2><span>Absent</span></div>
            <div className="attendance-number"><h2>{Math.max(0, employees.length - presentCount - absentCount)}</h2><span>Not marked</span></div>
          </div>
          <div className="panel-heading leave-heading">
            <div><h3>Recent Leave Requests</h3><p>Latest employee requests</p></div>
            <button className="text-btn" onClick={() => changePage("Leave Requests")}>View all</button>
          </div>
          {leaves.slice(0, 3).map(leave => (
            <div className="leave-mini" key={leave.id}>
              <div className="avatar">{leave.name.charAt(0)}</div>
              <div className="leave-mini-info"><strong>{leave.name}</strong><small>{leave.type}</small></div>
              {statusBadge(leave.status)}
            </div>
          ))}
          {leaves.length === 0 && <p className="empty-text">No leave requests.</p>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div><h3>Recent Employees</h3><p>Latest employee records</p></div>
          <button className="text-btn" onClick={() => changePage("Employees")}>View all</button>
        </div>
        <EmployeeTable
          employees={employees.slice(0, 5)}
          onView={openView}
          onEdit={openEdit}
          onDelete={(id) => { setDeleteId(id); setModal("delete"); }}
          statusBadge={statusBadge}
        />
      </div>
    </>
  );

  const EmployeeTable = ({ employees: rows, onView, onEdit, onDelete, statusBadge: badge }) => (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th><th>Department</th><th>Role</th><th>Joining Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(emp => (
            <tr key={emp.id}>
              <td><div className="employee-cell"><div className="avatar">{emp.name.charAt(0)}</div><div><strong>{emp.name}</strong><small>{emp.email}</small></div></div></td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.joiningDate || "—"}</td>
              <td>{badge(emp.status)}</td>
              <td>
                <div className="action-buttons">
                  <button title="View" onClick={() => onView(emp)}>◉</button>
                  <button title="Edit" onClick={() => onEdit(emp)}>✎</button>
                  <button title="Delete" onClick={() => onDelete(emp.id)}>⌫</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="empty-state">No employee records found.</div>}
    </div>
  );

  const renderEmployees = () => (
    <>
      <div className="welcome-row">
        <div><h2>Employee Directory</h2><p>Manage and organize your employee records.</p></div>
        <button className="primary-btn" onClick={openAdd}>＋ Add Employee</button>
      </div>
      <div className="panel">
        <div className="filter-bar">
          <input placeholder="⌕ Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option><option>Active</option><option>Inactive</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option><option value="department">Sort by Department</option><option value="role">Sort by Role</option>
          </select>
        </div>
        <EmployeeTable
          employees={displayedEmployees}
          onView={openView}
          onEdit={openEdit}
          onDelete={id => { setDeleteId(id); setModal("delete"); }}
          statusBadge={statusBadge}
        />
        <div className="pagination">
          <span>Showing {filteredEmployees.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length}</span>
          <div><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button><span>{currentPage} / {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button></div>
        </div>
      </div>
    </>
  );

  const renderDepartments = () => (
    <>
      <div className="welcome-row"><div><h2>Department Management</h2><p>Manage your organization's departments.</p></div></div>
      <div className="panel">
        <h3>Add New Department</h3>
        <div className="add-department">
          <input placeholder="Enter department name" value={newDepartment} onChange={e => setNewDepartment(e.target.value)} onKeyDown={e => e.key === "Enter" && addDepartment()} />
          <button className="primary-btn" onClick={addDepartment}>＋ Add Department</button>
        </div>
      </div>
      <div className="department-cards">
        {departments.map(dept => (
          <div className="department-card" key={dept}>
            <div className="dept-icon">▤</div>
            <h3>{dept}</h3>
            <p>{employees.filter(e => e.department === dept).length} Employees</p>
            <button className="danger-outline" onClick={() => deleteDepartment(dept)}>Delete Department</button>
          </div>
        ))}
      </div>
      {departments.length === 0 && <div className="panel empty-state">No departments found. Add one above.</div>}
    </>
  );

  const renderLeaves = () => (
    <>
      <div className="welcome-row"><div><h2>Leave Requests</h2><p>Review and manage employee leave applications.</p></div></div>
      <div className="stats-grid small-stats">
        <div className="stat-card"><div><p>Total Requests</p><h2>{leaves.length}</h2></div></div>
        <div className="stat-card"><div><p>Pending</p><h2>{pendingLeaves}</h2></div></div>
        <div className="stat-card"><div><p>Approved</p><h2>{leaves.filter(l => l.status === "Approved").length}</h2></div></div>
        <div className="stat-card"><div><p>Rejected</p><h2>{leaves.filter(l => l.status === "Rejected").length}</h2></div></div>
      </div>
      <div className="panel">
        <div className="panel-heading"><div><h3>All Leave Applications</h3><p>Employee leave history and actions</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Leave Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong></td><td>{l.type}</td><td>{l.from}</td><td>{l.to}</td><td>{l.reason}</td><td>{statusBadge(l.status)}</td>
                  <td>{l.status === "Pending" ? <div className="leave-actions"><button className="approve-btn" onClick={() => updateLeave(l.id, "Approved")}>Approve</button><button className="reject-btn" onClick={() => updateLeave(l.id, "Rejected")}>Reject</button></div> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && <div className="empty-state">No leave requests found.</div>}
        </div>
      </div>
    </>
  );

  const renderAttendance = () => (
    <>
      <div className="welcome-row"><div><h2>Attendance Summary</h2><p>Track daily employee attendance.</p></div><span className="date-label">{today}</span></div>
      <div className="stats-grid">
        <div className="stat-card"><div><p>Total Employees</p><h2>{employees.length}</h2></div></div>
        <div className="stat-card"><div><p>Present Today</p><h2 className="green-text">{presentCount}</h2></div></div>
        <div className="stat-card"><div><p>Absent Today</p><h2 className="red-text">{absentCount}</h2></div></div>
        <div className="stat-card"><div><p>Not Marked</p><h2>{employees.length - presentCount - absentCount}</h2></div></div>
      </div>
      <div className="panel">
        <div className="panel-heading"><div><h3>Daily Attendance</h3><p>Mark present or absent for each employee.</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Today's Status</th><th>Mark Attendance</th></tr></thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td><div className="employee-cell"><div className="avatar">{emp.name.charAt(0)}</div><strong>{emp.name}</strong></div></td>
                  <td>{emp.department}</td><td>{emp.role}</td>
                  <td>{todayAttendance[emp.id] ? statusBadge(todayAttendance[emp.id]) : <span className="status-badge pending">Not Marked</span>}</td>
                  <td><div className="leave-actions"><button className="approve-btn" onClick={() => markAttendance(emp.id, "Present")}>Present</button><button className="reject-btn" onClick={() => markAttendance(emp.id, "Absent")}>Absent</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <div className="empty-state">No employees available.</div>}
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="welcome-row"><div><h2>Settings</h2><p>Manage your profile and application preferences.</p></div></div>
      <div className="panel settings-panel">
        <h3>Admin Profile</h3>
        <p>Update your administrator details.</p>
        <form onSubmit={e => { e.preventDefault(); notify("Profile saved successfully!"); }}>
          <label>Full Name<input required value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></label>
          <label>Email Address<input required type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></label>
          <label>Role<input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} /></label>
          <button className="primary-btn" type="submit">Save Profile</button>
        </form>
      </div>
      <div className="panel theme-panel">
        <div><h3>Appearance</h3><p>Choose your preferred dashboard theme.</p></div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀ Light Mode" : "☾ Dark Mode"}</button>
      </div>
    </>
  );

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="brand"><div className="brand-logo">E</div>{sidebarOpen && <span>Employ<span className="brand-highlight">Pro</span></span>}</div>
        <div className="sidebar-label">{sidebarOpen ? "MAIN MENU" : "MENU"}</div>
        <nav>
          {navItems.map(item => (
            <button key={item.name} className={page === item.name ? "nav-item active" : "nav-item"} onClick={() => changePage(item.name)} title={item.name}>
              <span className="nav-icon">{item.icon}</span>{sidebarOpen && <span>{item.name}</span>}
              {item.name === "Leave Requests" && pendingLeaves > 0 && sidebarOpen && <span className="nav-count">{pendingLeaves}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-avatar">A</div>
          {sidebarOpen && <div className="admin-info"><strong>{profile.name}</strong><small>Administrator</small></div>}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="breadcrumb">Pages / <strong>{page}</strong></span>
          </div>
          <div className="topbar-right">
            <button className="top-icon" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">{darkMode ? "☀" : "☾"}</button>
            <div className="top-profile"><div className="admin-avatar">A</div><div><strong>{profile.name}</strong><small>Admin</small></div></div>
          </div>
        </header>

        <section className="page-content">
          {page === "Dashboard" && renderDashboard()}
          {page === "Employees" && renderEmployees()}
          {page === "Departments" && renderDepartments()}
          {page === "Leave Requests" && renderLeaves()}
          {page === "Attendance" && renderAttendance()}
          {page === "Settings" && renderSettings()}
        </section>
        <footer className="footer">© 2026 EmployPro. Employee Management System.</footer>
      </main>

      {toast && <div className="toast">✓ {toast}</div>}

      {modal === "form" && (
        <div className="modal-overlay" onClick={() => setModal("")}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</h3><button onClick={() => setModal("")}>✕</button></div>
            <form className="employee-form" onSubmit={handleSaveEmployee}>
              <label>Full Name *<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter employee name" /></label>
              <label>Email Address *<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email" /></label>
              <label>Phone Number<input maxLength="10" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="10 digit phone number" /></label>
              <label>Department<select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{departments.map(d => <option key={d}>{d}</option>)}</select></label>
              <label>Job Role *<input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Enter job role" /></label>
              <label>Joining Date<input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} /></label>
              <label>Salary<input type="number" min="0" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Monthly salary" /></label>
              <label>Employment Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setModal("")}>Cancel</button><button type="submit" className="primary-btn">{selectedEmployee ? "Save Changes" : "Add Employee"}</button></div>
            </form>
          </div>
        </div>
      )}

      {modal === "view" && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setModal("")}>
          <div className="modal-card view-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Employee Profile</h3><button onClick={() => setModal("")}>✕</button></div>
            <div className="profile-heading"><div className="profile-avatar">{selectedEmployee.name.charAt(0)}</div><h2>{selectedEmployee.name}</h2><p>{selectedEmployee.role}</p>{statusBadge(selectedEmployee.status)}</div>
            <div className="profile-details">
              <p><span>Email</span><strong>{selectedEmployee.email}</strong></p>
              <p><span>Phone</span><strong>{selectedEmployee.phone || "—"}</strong></p>
              <p><span>Department</span><strong>{selectedEmployee.department}</strong></p>
              <p><span>Joining Date</span><strong>{selectedEmployee.joiningDate || "—"}</strong></p>
              <p><span>Salary</span><strong>₹{Number(selectedEmployee.salary).toLocaleString("en-IN")}</strong></p>
            </div>
            <button className="primary-btn full-btn" onClick={() => openEdit(selectedEmployee)}>Edit Profile</button>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="modal-overlay">
          <div className="modal-card confirm-card">
            <div className="delete-symbol">!</div>
            <h3>Delete Employee?</h3>
            <p>Are you sure you want to delete this employee record? This action cannot be undone.</p>
            <div className="modal-actions"><button className="cancel-btn" onClick={() => setModal("")}>Cancel</button><button className="delete-btn" onClick={handleDelete}>Delete Employee</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;