import { useState } from "react";
import Sidebar from "../components/Sidebar";
import UserTopbar from "../components/UserTopbar";
import "./Dashboard.css";

const courseAnalyticsData = [
  {
    id: 1,
    name: "LET On Boarding (Concept-Driven)",
    progress: 100,
    score: 95,
    modulesCompleted: 8,
    totalModules: 8,
    timeSpent: "14h 20m",
    status: "Completed"
  },
  {
    id: 2,
    name: "LET Express",
    progress: 70,
    score: 82,
    modulesCompleted: 7,
    totalModules: 10,
    timeSpent: "18h 45m",
    status: "In Progress"
  },
  {
    id: 3,
    name: "LET Advance",
    progress: 100,
    score: 91,
    modulesCompleted: 12,
    totalModules: 12,
    timeSpent: "22h 10m",
    status: "Completed"
  },
  {
    id: 4,
    name: "Integrative",
    progress: 40,
    score: 78,
    modulesCompleted: 2,
    totalModules: 5,
    timeSpent: "6h 15m",
    status: "In Progress"
  }
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <UserTopbar title="Analytics" />

        <div className="dashboard-content" style={{ flexDirection: "column", gap: "20px" }}>
          
          {/* Header & Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>
                Review Progress & Analytics
              </h2>
              <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
                Track your learning milestones, drill performance, and study time distribution.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", background: "#eef2ff", padding: "4px", borderRadius: "8px" }}>
              {["overview", "courses", "performance"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    border: "none",
                    background: activeTab === tab ? "#0D2A94" : "transparent",
                    color: activeTab === tab ? "#fff" : "#555",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.2s ease"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            
            <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
              <div style={{ background: "#e8f5e9", padding: "12px", borderRadius: "10px", color: "#2e7d32", display: "flex" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#777", fontWeight: "500" }}>Overall Completion</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e" }}>77.5%</div>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
              <div style={{ background: "#e0f2fe", padding: "12px", borderRadius: "10px", color: "#0284c7", display: "flex" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#777", fontWeight: "500" }}>Average Diagnostic Score</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e" }}>86.5%</div>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
              <div style={{ background: "#fef3c7", padding: "12px", borderRadius: "10px", color: "#d97706", display: "flex" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#777", fontWeight: "500" }}>Total Study Time</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e" }}>61.5 Hours</div>
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
              <div style={{ background: "#f3e8ff", padding: "12px", borderRadius: "10px", color: "#9333ea", display: "flex" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#777", fontWeight: "500" }}>Mock Board Readiness</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e" }}>High</div>
              </div>
            </div>

          </div>

          {/* Detailed Analytics Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            
            {/* Course Progress Breakdown */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D2A94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Course Breakdown</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {courseAnalyticsData.map((course) => (
                  <div key={course.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{course.name}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0D2A94" }}>{course.progress}%</span>
                    </div>

                    <div style={{ height: "8px", width: "100%", backgroundColor: "#eef2ff", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${course.progress}%`,
                          backgroundColor: course.progress === 100 ? "#4caf50" : "#0D2A94",
                          borderRadius: "4px",
                          transition: "width 0.4s ease"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#777" }}>
                      <span>Modules: <strong>{course.modulesCompleted}/{course.totalModules}</strong></span>
                      <span>Avg. Drill Score: <strong>{course.score}%</strong></span>
                      <span>Time Spent: <strong>{course.timeSpent}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Insights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D2A94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Insights & Recommendation</span>
                </div>
                <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.5" }}>
                  <p style={{ marginTop: 0 }}>
                    🎯 <strong>Strong Performance:</strong> You scored 95% in General Education drills.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    💡 <strong>Focus Area:</strong> Revisit <em>Integrative Mock Board Q&A</em> to improve completion status.
                  </p>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D2A94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Study Goal</span>
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  Weekly Goal: <strong>15 Hours</strong>
                  <div style={{ height: "8px", width: "100%", backgroundColor: "#eef2ff", borderRadius: "4px", margin: "8px 0" }}>
                    <div style={{ height: "100%", width: "80%", backgroundColor: "#f5a623", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#888" }}>12 hrs completed this week (80%)</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}