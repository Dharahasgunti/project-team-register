import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

const emptyForm = {
  rollNumber: "",
  studentName: "",
  teamName: "",
  projectTitle: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load student records.");
      }

      const data = await response.json();
      setStudents(data);
    } catch {
      setError(
        "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.detail ||
            "Unable to save the student record."
        );
      }

      setMessage(
        editingId
          ? "Student record updated successfully!"
          : "Student record added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);

      await loadStudents();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(student) {
    setForm({
      rollNumber: student.rollNumber,
      studentName: student.studentName,
      teamName: student.teamName,
      projectTitle: student.projectTitle,
    });

    setEditingId(student.id);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  async function deleteStudent(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.studentName}'s record?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${student.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete the student record.");
      }

      setMessage("Student record deleted successfully!");

      if (editingId === student.id) {
        cancelEdit();
      }

      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.rollNumber?.toLowerCase().includes(searchText) ||
      student.studentName?.toLowerCase().includes(searchText) ||
      student.teamName?.toLowerCase().includes(searchText) ||
      student.projectTitle?.toLowerCase().includes(searchText)
    );
  });

  const uniqueTeams = new Set(
    students.map((student) => student.teamName)
  ).size;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">PT</div>
          <div>
            <h2>Team Register</h2>
            <p>PROJECT MANAGEMENT</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <a className="nav-item active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>

        <a className="nav-item" href="#add-student">
          <span>＋</span> Add Student
        </a>

        <a className="nav-item" href="#records">
          <span>☷</span> Student Records
        </a>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <div>
            <strong>Project Workspace</strong>
            <p>Student management system</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <h1>Project Team Register</h1>
          </div>

          <div className="topbar-right">
            <span className="online-dot"></span>
            <span>System Online</span>
            <div className="avatar">PT</div>
          </div>
        </header>

        <section className="welcome-section" id="dashboard">
          <div>
            <span className="eyebrow">STUDENT PROJECT MANAGEMENT</span>
            <h2>Organize your teams. Track your projects.</h2>
            <p>
              Manage student information and keep all your project
              teams organized in one place.
            </p>
            <a className="primary-button" href="#add-student">
              + Register Student
            </a>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-card art-card-back">PROJECT</div>
            <div className="art-card art-card-front">
              <span className="art-symbol">✦</span>
              <strong>TEAMWORK</strong>
              <small>Ideas into action</small>
            </div>
            <div className="art-circle"></div>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon purple">♙</div>
            <div>
              <p>Total Students</p>
              <h3>{students.length}</h3>
              <span>Registered records</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon blue">◈</div>
            <div>
              <p>Total Teams</p>
              <h3>{uniqueTeams}</h3>
              <span>Unique team names</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>System Status</p>
              <h3 className="status-text">
                {error ? "Check" : loading ? "Loading" : "Active"}
              </h3>
              <span>API connection status</span>
            </div>
          </article>
        </section>

        {message && (
          <div className="alert success-alert">
            <span>✓</span> {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {error && (
          <div className="alert error-alert">
            <span>!</span> {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <section className="content-grid">
          <article className="panel form-panel" id="add-student">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">
                  {editingId ? "UPDATE INFORMATION" : "NEW REGISTRATION"}
                </span>
                <h2>{editingId ? "Edit Student" : "Register Student"}</h2>
              </div>
              <span className="heading-icon">＋</span>
            </div>

            <p className="panel-description">
              Enter the student and project details below.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                id="rollNumber"
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 25EG504F09"
                maxLength={30}
                required
                disabled={Boolean(editingId)}
              />

              <label htmlFor="studentName">Student Name</label>
              <input
                id="studentName"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter full name"
                maxLength={100}
                required
              />

              <label htmlFor="teamName">Team Name</label>
              <input
                id="teamName"
                name="teamName"
                value={form.teamName}
                onChange={handleChange}
                placeholder="e.g. Team Alpha"
                maxLength={100}
                required
              />

              <label htmlFor="projectTitle">Project Title</label>
              <textarea
                id="projectTitle"
                name="projectTitle"
                value={form.projectTitle}
                onChange={handleChange}
                placeholder="Enter your project title"
                maxLength={200}
                rows={3}
                required
              />

              <button
                className="submit-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes →"
                    : "Register Student →"}
              </button>

              {editingId && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </article>

          <article className="panel records-panel" id="records">
            <div className="panel-heading records-heading">
              <div>
                <span className="section-kicker">DATABASE OVERVIEW</span>
                <h2>Student Records</h2>
              </div>
              <span className="record-count">
                {filteredStudents.length} records
              </span>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search name, roll no, team..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search student records"
              />
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">◌</div>
                <h3>Loading records...</h3>
                <p>Please wait while we connect to your database.</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">☷</div>
                <h3>
                  {search ? "No matching records" : "No records found"}
                </h3>
                <p>
                  {search
                    ? "Try another search term."
                    : "Register a student using the form to get started."}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>TEAM & PROJECT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {student.studentName
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <strong>{student.studentName}</strong>
                              <span>{student.rollNumber}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="project-cell">
                            <strong>{student.teamName}</strong>
                            <span>{student.projectTitle}</span>
                          </div>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              title="Edit record"
                              aria-label={`Edit ${student.studentName}`}
                              onClick={() => startEdit(student)}
                            >
                              ✎
                            </button>

                            <button
                              className="delete-button"
                              title="Delete record"
                              aria-label={`Delete ${student.studentName}`}
                              onClick={() => deleteStudent(student)}
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="records-footer">
              <span>
                Data stored in <strong>MySQL</strong>
              </span>
              <button onClick={loadStudents}>↻ Refresh Records</button>
            </div>
          </article>
        </section>

        <footer className="footer">
          <span>© 2026 Project Team Register</span>
          <span>Built with React, Spring Boot & MySQL</span>
        </footer>
      </main>
    </div>
  );
}

export default App;