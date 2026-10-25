import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/assignments";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const menuItems = [
    "Dashboard",
    "Add Assignment",
    "Manage Assignments",
    "Analytics",
  ];

  async function fetchAssignments() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load assignments.");
      }

      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(
        "Cannot connect to the backend. Make sure your server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function saveAssignment(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const newAssignment = {
      title: formData.get("title"),
      subject: formData.get("subject"),
      deadline: formData.get("deadline"),
      priority: formData.get("priority"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save assignment.");
      }

      await fetchAssignments();
      form.reset();
      setPage("Dashboard");
      alert("Assignment added successfully!");
    } catch (err) {
      alert(err.message || "Could not connect to the backend.");
    }
  }

  async function editAssignment(item) {
    const title = window.prompt("Assignment title:", item.title);
    if (title === null) return;

    const subject = window.prompt("Subject:", item.subject);
    if (subject === null) return;

    const deadline = window.prompt(
      "Deadline (YYYY-MM-DD):",
      new Date(item.deadline).toISOString().slice(0, 10)
    );
    if (deadline === null) return;

    const priority = window.prompt(
      "Priority (Low, Medium, High):",
      item.priority
    );
    if (priority === null) return;

    const description = window.prompt(
      "Description:",
      item.description || ""
    );
    if (description === null) return;

    if (!title.trim() || !subject.trim() || !deadline.trim()) {
      alert("Title, subject, and deadline are required.");
      return;
    }

    if (
      !["Low", "Medium", "High"].includes(priority)
    ) {
      alert("Priority must be Low, Medium, or High.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          deadline,
          priority,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update assignment.");
      }

      await fetchAssignments();
      alert("Assignment updated successfully!");
    } catch (err) {
      alert(err.message || "Could not update assignment.");
    }
  }

  async function markCompleted(item) {
    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Completed",
        }),
      });

      if (!response.ok) {
        throw new Error("Could not update assignment.");
      }

      await fetchAssignments();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteAssignment(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete assignment.");
      }

      await fetchAssignments();
    } catch (err) {
      alert(err.message);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = assignments.length;

  const pending = assignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const completed = assignments.filter(
    (item) => item.status === "Completed"
  ).length;

  const overdue = assignments.filter((item) => {
    const deadline = new Date(item.deadline);
    deadline.setHours(0, 0, 0, 0);

    return item.status === "Pending" && deadline < today;
  }).length;

  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const subjectStats = assignments.reduce((stats, item) => {
    if (!stats[item.subject]) {
      stats[item.subject] = {
        total: 0,
        completed: 0,
      };
    }

    stats[item.subject].total += 1;

    if (item.status === "Completed") {
      stats[item.subject].completed += 1;
    }

    return stats;
  }, {});

  const upcomingAssignments = assignments
    .filter((item) => item.status === "Pending")
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 5);
    const urgentAssignments = assignments.filter((item) => {
  if (item.status !== "Pending") return false;

  const deadline = new Date(item.deadline);
  deadline.setHours(0, 0, 0, 0);

  const daysRemaining = Math.ceil(
    (deadline - today) / (1000 * 60 * 60 * 24)
  );

  return daysRemaining <= 3;
});

  const filteredAssignments = assignments.filter((item) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      (item.title || "").toLowerCase().includes(query) ||
      (item.subject || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>📚 StudyFlow</h2>
        <p className="tagline">Your personal study planner</p>

        <h3>Navigation</h3>

        {menuItems.map((item) => (
          <button
            key={item}
            className={`nav-button ${
              page === item ? "active" : ""
            }`}
            onClick={() => setPage(item)}
          >
            {item}
          </button>
        ))}

        <div className="goal">
          <h3>🎯 Your goal</h3>
          <p>Stay organized. Learn consistently. Succeed.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Organize your assignments and stay on track.</p>
          </div>

          <span className="profile">👩‍🎓 Student</span>
        </header>

        {error && (
          <section className="panel">
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={fetchAssignments}
            >
              Try Again
            </button>
          </section>
        )}

        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <h2>Welcome to StudyFlow! 👋</h2>
              <p>Your academic tasks, all in one place.</p>
            </section>

            <section className="stats">
              <div className="stat-card">
                <span>Total Assignments</span>
                <h2>{loading ? "..." : total}</h2>
              </div>

              <div className="stat-card">
                <span>Pending</span>
                <h2>{loading ? "..." : pending}</h2>
              </div>

              <div className="stat-card">
                <span>Completed</span>
                <h2>{loading ? "..." : completed}</h2>
              </div>

              <div className="stat-card">
                <span>Overdue</span>
                <h2>{loading ? "..." : overdue}</h2>
              </div>
            </section>

            <section className="panel">
              <h2>📅 Upcoming Assignments</h2>
              {!loading && (
  <div className="deadline-alerts">
    <h3>🔔 Deadline Notifications</h3>

    {urgentAssignments.length === 0 ? (
      <p>No urgent deadlines. Keep up the good work!</p>
    ) : (
      urgentAssignments.map((item) => {
        const deadline = new Date(item.deadline);
        deadline.setHours(0, 0, 0, 0);

        const daysRemaining = Math.ceil(
          (deadline - today) / (1000 * 60 * 60 * 24)
        );

        return (
          <div className="assignment-item" key={item._id}>
            <strong>
              {daysRemaining < 0
                ? "🔴 Overdue"
                : daysRemaining === 0
                ? "🟠 Due today"
                : `🟠 Due in ${daysRemaining} day(s)`}
            </strong>

            <p>{item.title}</p>
            <p>Subject: {item.subject}</p>
            <p>
              Deadline: {deadline.toLocaleDateString()}
            </p>
          </div>
        );
      })
    )}
  </div>
)}


              {loading ? (
                <p className="empty">Loading assignments...</p>
              ) : upcomingAssignments.length === 0 ? (
                <p className="empty">
                  No pending assignments. Add your first assignment!
                </p>
              ) : (
                upcomingAssignments.map((item) => (
                  <div className="assignment-item" key={item._id}>
                    <h3>{item.title}</h3>
                    <p>Subject: {item.subject}</p>
                    <p>
                      Deadline:{" "}
                      {new Date(item.deadline).toLocaleDateString()}
                    </p>
                    <p>Priority: {item.priority}</p>
                  </div>
                ))
              )}

              <button
                className="primary-button"
                onClick={() => setPage("Add Assignment")}
              >
                + Add Assignment
              </button>
            </section>
          </>
        )}

        {page === "Add Assignment" && (
          <section className="panel">
            <h2>📝 Add a New Assignment</h2>

            <form onSubmit={saveAssignment}>
              <label htmlFor="title">Assignment Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. DBMS Mini Project"
                required
              />

              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Database Management Systems"
                required
              />

              <label htmlFor="deadline">Deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                required
              />

              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                defaultValue="Medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label htmlFor="description">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter assignment details..."
                rows="4"
              />

              <button
                className="primary-button"
                type="submit"
              >
                Save Assignment
              </button>
            </form>
          </section>
        )}

        {page === "Manage Assignments" && (
          <section className="panel">
            <h2>📋 Manage Your Work</h2>

            <div className="assignment-filters">
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Assignments</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <p>Loading assignments...</p>
            ) : filteredAssignments.length === 0 ? (
              <p className="empty">
                No matching assignments found.
              </p>
            ) : (
              filteredAssignments.map((item) => (
                <div className="assignment-item" key={item._id}>
                  <h3>{item.title}</h3>
                  <p>Subject: {item.subject}</p>
                  <p>
                    Deadline:{" "}
                    {new Date(item.deadline).toLocaleDateString()}
                  </p>
                  <p>Priority: {item.priority}</p>
                  <p>Status: {item.status}</p>

                  {item.description && (
                    <p>Description: {item.description}</p>
                  )}

                  <div className="assignment-actions">
                    <button
                      className="primary-button"
                      onClick={() => editAssignment(item)}
                    >
                      Edit
                    </button>

                    {item.status === "Pending" && (
                      <button
                        className="primary-button"
                        onClick={() => markCompleted(item)}
                      >
                        Mark Completed
                      </button>
                    )}

                    <button
                      className="primary-button"
                      onClick={() => deleteAssignment(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {page === "Analytics" && (
          <section className="panel">
            <h2>📊 Assignment Analytics</h2>

            {loading ? (
              <p>Loading analytics...</p>
            ) : (
              <>
                <section className="stats">
                  <div className="stat-card">
                    <span>Total Assignments</span>
                    <h2>{total}</h2>
                  </div>

                  <div className="stat-card">
                    <span>Completed</span>
                    <h2>{completed}</h2>
                  </div>

                  <div className="stat-card">
                    <span>Pending</span>
                    <h2>{pending}</h2>
                  </div>

                  <div className="stat-card">
                    <span>Completion Rate</span>
                    <h2>{completionRate}%</h2>
                  </div>
                </section>

                <h3>📚 Subject-wise Progress</h3>

                {Object.keys(subjectStats).length === 0 ? (
                  <p className="empty">
                    Add assignments to see your analytics.
                  </p>
                ) : (
                  Object.entries(subjectStats).map(
                    ([subject, stats]) => {
                      const percentage = Math.round(
                        (stats.completed / stats.total) * 100
                      );

                      return (
                        <div
                          className="assignment-item"
                          key={subject}
                        >
                          <h3>{subject}</h3>
                          <p>Total: {stats.total}</p>
                          <p>Completed: {stats.completed}</p>
                          <p>
                            Pending:{" "}
                            {stats.total - stats.completed}
                          </p>
                          <p>Completion: {percentage}%</p>

                          <div className="progress-label">
  <span>Completion</span>
  <span>{percentage}%</span>
</div>

<div className="progress-track">
  <div
    className="progress-fill"
    style={{ width: `${percentage}%` }}
  />
</div>
                        </div>
                      );
                    }
                  )
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;