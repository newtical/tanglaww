import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Image,
  Quote,
  Sparkles,
  TrendingUp,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardBanner from "../assets/dashboardBanner.png";
import Sidebar from "../components/Sidebar";
import UserTopbar from "../components/UserTopbar";
import { supabase } from "../lib/supabase";
import "./Dashboard.css";

const affirmations = [
  "I am fully capable of mastering all review materials and passing my exam with flying colors.",
  "Every hour of study brings me one step closer to becoming a licensed professional teacher.",
  "I trust my process, stay consistent, and focus on my growth every day.",
  "Challenges are just opportunities to sharpen my knowledge and build confidence.",
  "I am resilient, prepared, and deserving of success in my upcoming board examination."
];

const coursesData = [
  {
    id: "c1",
    name: "LET On Boarding (Concept-Driven)",
    instructor: "Mr. Rue Alun",
    progress: 100,
    color: "#4caf50",
    handouts: [
      { id: "h1", title: "LET Foundations & Orientation Guide.pdf", size: "2.4 MB" },
      { id: "h2", title: "Concept-Driven Review Blueprint 2026.pdf", size: "3.1 MB" },
    ],
  },
  {
    id: "c2",
    name: "LET Express",
    instructor: "Mr. Rue Alun",
    progress: 70,
    color: "#ffb800",
    handouts: [
      { id: "h3", title: "General Education Express Notes.pdf", size: "4.5 MB" },
      { id: "h4", title: "Professional Education High-Yield Drill.pdf", size: "1.8 MB" },
      { id: "h5", title: "Quick Formula & Laws Cheat Sheet.pdf", size: "850 KB" },
    ],
  },
  {
    id: "c3",
    name: "LET Advance",
    instructor: "Mr. Rue Alun",
    progress: 100,
    color: "#4caf50",
    handouts: [
      { id: "h6", title: "Advanced Pedagogy & Assessment Module.pdf", size: "5.2 MB" },
      { id: "h7", title: "Curriculum Development Deep Dive.pdf", size: "3.7 MB" },
    ],
  },
  {
    id: "c4",
    name: "Integrative",
    instructor: "Mr. Rue Alun",
    progress: 70,
    color: "#ffb800",
    handouts: [
      { id: "h8", title: "Integrative Mock Board Examination Q&A.pdf", size: "6.0 MB" },
    ],
  },
];

const deadlines = [
  { title: "LET Express - Online Session", date: "Oct 23, 2025", time: "10:00AM" },
  { title: "LET Advance - Online Session", date: "Oct 24, 2025", time: "10:00AM" },
];

function ProgressRing({ percent }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="progress-ring-container">
      <svg width="96" height="96" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e8eaf6" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#0D2A94"
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0D2A94">
          {percent}%
        </text>
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setAnnouncements(data ?? []);
    };
    fetchAnnouncements();

    // Select a daily affirmation randomly
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  }, []);

  const toggleCourseExpand = (courseId, e) => {
    e.stopPropagation(); // Prevents navigating to the course page when clicking the chevron
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const renderCourseCard = (c) => {
    const isExpanded = expandedCourseId === c.id;
    return (
      <div key={c.id} className={`course-card ${isExpanded ? "expanded" : ""}`}>
        {/* Clickable Course Header - Navigates to course route */}
        <div 
          className="course-thumb" 
          onClick={() => navigate(`/dashboard/courses/${c.id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="course-progress-badge">
            <div className="progress-dot" style={{ backgroundColor: c.color }} />
            {c.progress}%
          </div>
          <Image size={28} color="#90a4ae" />
        </div>

        <div className="course-info">
          <div 
            className="course-header-row" 
            onClick={() => navigate(`/dashboard/courses/${c.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <div className="course-name">{c.name}</div>
              <div className="course-instructor">{c.instructor}</div>
            </div>
            
            {/* Separate dropdown arrow trigger */}
            <button
              type="button"
              className="course-expand-btn"
              aria-label="Toggle Handouts"
              onClick={(e) => toggleCourseExpand(c.id, e)}
            >
              {isExpanded ? <ChevronUp size={16} color="#0D2A94" /> : <ChevronDown size={16} color="#888" />}
            </button>
          </div>

          {/* Handouts Accordion Content */}
          {isExpanded && (
            <div className="handouts-section" onClick={(e) => e.stopPropagation()}>
              <div className="handouts-title">
                <BookOpen size={13} color="#0D2A94" />
                <span>Course Handouts & Resources</span>
              </div>
              <div className="handouts-list">
                {c.handouts.map((h) => (
                  <div key={h.id} className="handout-item">
                    <div className="handout-left">
                      <FileText size={15} color="#0D2A94" />
                      <div>
                        <div className="handout-name">{h.title}</div>
                        <div className="handout-size">{h.size}</div>
                      </div>
                    </div>
                    <a href={`#download-${h.id}`} className="handout-download-btn" title="Download Handout">
                      <Download size={14} color="#0D2A94" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const inProgressCourses = coursesData.filter((c) => c.progress < 100);
  const completedCourses = coursesData.filter((c) => c.progress === 100);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <UserTopbar title="Dashboard" />
        <div className="dashboard-content">

          {/* LEFT */}
          <div className="dashboard-left">

            {/* Welcome Banner */}
            <div className="card">
              <div className="card-title">Welcome Back!</div>
              <div className="banner-carousel">
                <img src={dashboardBanner} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="carousel-dots">
                <div className="dot active" /><div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>

            {/* Announcements */}
            {announcements.length > 0 && (
              <div className="card">
                <div className="card-title">📢 Announcements</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {announcements.map((a) => (
                    <div key={a.id} className="announcement-item">
                      <div className="announcement-title">{a.title}</div>
                      <div className="announcement-content">{a.content}</div>
                      <div className="announcement-date">
                        {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Session */}
            <div className="card">
              <div className="card-title">Continue where you left off...</div>
              <div className="session-card" onClick={() => navigate("/dashboard/courses")}>
                <div>
                  <div className="session-label">Recorded Session</div>
                  <div className="session-title">LET Express</div>
                </div>
                <ArrowRight size={20} color="#0D2A94" />
              </div>
            </div>

            {/* In Progress Courses Section */}
            <div className="card">
              <div className="card-title">In Progress Courses</div>
              <div className="courses-grid">
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map(renderCourseCard)
                ) : (
                  <p style={{ fontSize: "13px", color: "#888" }}>No active courses in progress.</p>
                )}
              </div>
            </div>

            {/* Completed Courses Section */}
            <div className="card">
              <div className="card-title">Completed Courses</div>
              <div className="courses-grid">
                {completedCourses.length > 0 ? (
                  completedCourses.map(renderCourseCard)
                ) : (
                  <p style={{ fontSize: "13px", color: "#888" }}>No completed courses yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="dashboard-right">

            {/* Profile */}
            <div className="card">
              <div className="profile-banner" />
              <div className="profile-avatar"><User size={32} color="#9e9e9e" /></div>
              <div className="profile-name">JOHN DOE</div>
              <div className="profile-degree">Bachelor of Elementary Education</div>
              <div className="profile-email">johndoejucat19@gmail.com</div>
            </div>

            <div 
              className="card analytics-card"
              onClick={() => navigate("/dashboard/Analytics")}
              style={{ cursor: "pointer", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="analytics-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TrendingUp size={16} color="#0D2A94" />
                  <span className="analytics-title">Review Progress</span>
                </div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#0D2A94", display: "flex", alignItems: "center", gap: "2px" }}>
                  View Insights <ArrowRight size={12} />
                </div>
              </div>

              <div className="progress-ring-wrap">
                <ProgressRing percent={54} />
                <div className="readiness-tag">
                  <CheckCircle2 size={12} color="#2e7d32" />
                  <span>On Track for LET</span>
                </div>
              </div>

              {/* Analytics Breakdown Bars */}
              <div className="analytics-metrics">
                <div className="metric-row">
                  <div className="metric-info">
                    <span>Handouts Studied</span>
                    <strong>18/24</strong>
                  </div>
                  <div className="metric-bar-bg">
                    <div className="metric-bar-fill" style={{ width: "75%", backgroundColor: "#0D2A94" }} />
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-info">
                    <span>Mock Exam Score</span>
                    <strong>82%</strong>
                  </div>
                  <div className="metric-bar-bg">
                    <div className="metric-bar-fill" style={{ width: "82%", backgroundColor: "#FFB800" }} />
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-info">
                    <span>Video Attendance</span>
                    <strong>60%</strong>
                  </div>
                  <div className="metric-bar-bg">
                    <div className="metric-bar-fill" style={{ width: "60%", backgroundColor: "#2e7d32" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Affirmation */}
            <div className="card" style={{ background: "linear-gradient(135deg, #0D2A94 0%, #1a3ab8 100%)", color: "#ffffff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Sparkles size={16} color="#ffd700" />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>Daily Affirmation</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <Quote size={20} color="#ffd700" style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", lineHeight: "1.5", fontStyle: "italic", color: "#e0e7ff", margin: 0 }}>
                  {affirmation}
                </p>
              </div>
            </div>

            {/* Deadlines */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <Clock size={16} color="#0D2A94" />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Deadlines</span>
              </div>
              {deadlines.map((d, i) => (
                <div key={i} className="deadline-item">
                  <div className="deadline-title">{d.title}</div>
                  <div className="deadline-meta">{d.date} · {d.time}</div>
                  <div className="deadline-link">Join session →</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}