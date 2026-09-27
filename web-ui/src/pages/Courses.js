import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Image,
  Lock,
  Search,
  TrendingUp,
  Video
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import integrative from "../assets/images/integrative.jpg";
import letAdvanced from "../assets/images/let-advanced.jpg";
import letExpress from "../assets/images/let-express.jpg";
import letOnBoarding from "../assets/images/let-on-boarding.jpg";
import NotificationBell from "../components/NotificationBell";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import "./Dashboard.css";

const courses = [
  {
    id: 1,
    name: "LET On Boarding (Concept-Driven)",
    instructor: "Mr. Ruel Atun",
    progress: 100,
    color: "#4caf50",
    contents: [
      { id: "m101", title: "Orientation & Blueprint Overview", type: "video" },
      { id: "m102", title: "General Education Diagnostic Drill", type: "handout" },
    ],
  },
  {
    id: 2,
    name: "LET Express",
    instructor: "Mr. Ruel Atun",
    progress: 70,
    color: "#4caf50",
    contents: [
      { id: "m201", title: "High-Yield Professional Education Drill", type: "video" },
      { id: "m202", title: "LET Express Formula & Key Terms.pdf", type: "handout" },
      { id: "m203", title: "Recorded Intensive Review Session", type: "video" },
    ],
  },
  {
    id: 3,
    name: "LET Advance",
    instructor: "Mr. Ruel Atun",
    progress: 100,
    color: "#4caf50",
    contents: [
      { id: "m301", title: "Advanced Pedagogy & Assessment Module", type: "handout" },
      { id: "m302", title: "Curriculum Development Deep Dive", type: "video" },
    ],
  },
  {
    id: 4,
    name: "Integrative",
    instructor: "Mr. Ruel Atun",
    progress: 70,
    color: "#4caf50",
    contents: [
      { id: "m401", title: "Integrative Mock Board Examination Q&A", type: "handout" },
    ],
  },
];

const courseImages = {
  1: letOnBoarding,
  2: letExpress,
  3: letAdvanced,
  4: integrative,
};

const deadlines = [
  { title: "LET Express - Online Session", date: "Oct 23, 2025", time: "10:00AM", link: "zoom.us/join" },
  { title: "LET Advance - Online Session", date: "Oct 24, 2025", time: "10:00AM", link: "zoom.us/join" },
];

const leaderboard = [
  { rank: 3, height: 60, color: "#f5a623" },
  { rank: 2, height: 80, color: "#f5a623" },
  { rank: 1, height: 110, color: "#4caf50" },
];

function LeaderboardChart() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "12px", height: "130px", marginTop: "8px" }}>
      {leaderboard.map((b, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{
            width: "40px",
            height: `${b.height}px`,
            backgroundColor: b.color,
            borderRadius: "6px 6px 0 0",
          }} />
        </div>
      ))}
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const [accessibleCourses, setAccessibleCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  useEffect(() => {
    fetchUserCourseAccess();
  }, []);

  const fetchUserCourseAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: student } = await supabase
        .from("student")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!student) {
        setLoading(false);
        return;
      }

      const { data: accessRows } = await supabase
        .from("course_access")
        .select("course_id")
        .eq("student_id", student.id);

      setAccessibleCourses(new Set((accessRows ?? []).map((r) => r.course_id)));
    } catch (err) {
      console.error("Error fetching course access:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (courseId, e) => {
    e.stopPropagation();
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const handleCourseClick = (courseId, isLocked) => {
    if (!isLocked) {
      navigate(`/dashboard/courses/${courseId}`);
    }
  };

  const handleContentClick = (e, courseId, contentId) => {
    e.stopPropagation();
    navigate(`/dashboard/courses/${courseId}/materials/${contentId}`);
  };

  const renderCourseCard = (c) => {
    const isLocked = !accessibleCourses.has(c.id);
    const isExpanded = expandedCourseId === c.id;

    return (
      <div
        key={c.id}
        style={{
          border: isExpanded ? "1px solid #0D2A94" : "1px solid #eee",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
          transition: "all 0.2s ease",
        }}
      >
        {/* Thumbnail Header - Navigates to Course View */}
        <div
          onClick={() => handleCourseClick(c.id, isLocked)}
          style={{
            backgroundColor: "#e8eaf6",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            color: "#bbb",
            cursor: isLocked ? "default" : "pointer",
          }}
        >
          <div style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "12px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            zIndex: 2
          }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c.color }} />
            {c.progress}%
          </div>

          {courseImages[c.id] ? (
            <img src={courseImages[c.id]} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isLocked ? 0.4 : 1 }} />
          ) : (
            <Image size={28} color="#bbb" />
          )}

          {isLocked && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.15)",
            }}>
              <Lock size={48} color="white" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Title Bar & Chevron Trigger */}
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <div
            onClick={() => handleCourseClick(c.id, isLocked)}
            style={{ cursor: isLocked ? "default" : "pointer", flexGrow: 1 }}
          >
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{c.name}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{c.instructor}</div>
            {isLocked && (
              <div style={{ fontSize: "12px", color: "#e53935", marginTop: "4px", fontWeight: "500" }}>
                This course is currently locked
              </div>
            )}
          </div>

          {!isLocked && (
            <button
              type="button"
              onClick={(e) => toggleAccordion(c.id, e)}
              aria-label="Toggle contents"
              style={{
                background: "#f0f3ff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginLeft: "12px",
                flexShrink: 0
              }}
            >
              {isExpanded ? <ChevronUp size={18} color="#0D2A94" /> : <ChevronDown size={18} color="#777" />}
            </button>
          )}
        </div>

        {/* Expandable Inner Content List */}
        {isExpanded && !isLocked && (
          <div style={{
            padding: "0 16px 16px",
            borderTop: "1px dashed #e0e0e0",
            backgroundColor: "#fafafa"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#0D2A94",
              margin: "12px 0 8px"
            }}>
              <BookOpen size={14} />
              <span>Course Contents Overview</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {c.contents && c.contents.length > 0 ? (
                c.contents.map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => handleContentClick(e, c.id, item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0D2A94")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {item.type === "video" ? (
                        <Video size={16} color="#0D2A94" />
                      ) : (
                        <FileText size={16} color="#0D2A94" />
                      )}
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                        {item.title}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#0D2A94", fontWeight: "600" }}>
                      Open →
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                  No materials uploaded yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const inProgressCourses = courses.filter((c) => c.progress < 100);
  const completedCourses = courses.filter((c) => c.progress === 100);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-search">
            <Search size={16} color="#aaa" />
            <input placeholder="Enter search terms" />
          </div>
          <div className="topbar-right">
            <NotificationBell />
          </div>
        </div>

        {/* Content */}
        <div className="dashboard-content">

          {/* LEFT - Segregated Course Lists */}
          <div className="dashboard-left">
            {/* In Progress Section */}
            <div className="card" style={{ marginBottom: "16px" }}>
              <div className="card-title">In Progress Courses</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map(renderCourseCard)
                ) : (
                  <div style={{ fontSize: "13px", color: "#888" }}>No active courses in progress.</div>
                )}
              </div>
            </div>

            {/* Completed Section */}
            <div className="card">
              <div className="card-title">Completed Courses</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {completedCourses.length > 0 ? (
                  completedCourses.map(renderCourseCard)
                ) : (
                  <div style={{ fontSize: "13px", color: "#888" }}>No completed courses yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-right">

            {/* Profile */}
            <div className="card">
              <div className="profile-banner" />
              <div className="profile-avatar" style={{ fontSize: "28px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="profile-name">JOHN DOE</div>
              <div className="profile-degree">Bachelor of Elementary Education</div>
              <div className="profile-email">johndoejacat10@gmail.com</div>
            </div>

            {/* Leaderboards */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <TrendingUp size={16} color="#1a1a6e" />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Leaderboards</span>
              </div>
              <LeaderboardChart />
            </div>

            {/* Deadlines */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <Clock size={16} color="#1a1a6e" />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Deadlines</span>
              </div>
              {deadlines.map((d, i) => (
                <div key={i} className="deadline-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="deadline-title">{d.title}</div>
                    <div style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap", marginLeft: "8px" }}>
                      {d.date}<br />{d.time}
                    </div>
                  </div>
                  <div className="deadline-link">{d.link}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}