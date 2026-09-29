import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/dashboardlogo.png";

const navItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Courses", path: "/dashboard/courses" },
  { label: "Calendar", path: "/dashboard/calendar" },
  { label: "Profile", path: "/dashboard/profile" },
];

const bottomItems = [
  { label: "Settings", path: "/dashboard/settings" },
  { label: "Help", path: "/dashboard/help" },
  { label: "About", path: "/dashboard/about" },
  { label: "Terms & Policies", path: "/dashboard/terms" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  return (
    <aside className="sidebar">
      <img src={logo} alt="Tanglaw" className="sidebar-logo" />
      <span className="sidebar-section-label">Overview</span>
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </div>
      ))}
      <div className="sidebar-bottom">
        {bottomItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
        <div
          className="sidebar-link signout"
          onClick={() => setShowSignOutConfirm(true)}
        >
          Sign Out
        </div>
      </div>
      {showSignOutConfirm && (
        <div
          className="signout-modal-backdrop"
          onClick={() => setShowSignOutConfirm(false)}
        >
          <section
            className="signout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="signout-modal-title">Sign out?</h2>
            <p>Are you sure you want to sign out of your account?</p>
            <div className="signout-modal-actions">
              <button
                type="button"
                className="signout-modal-cancel"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="signout-modal-confirm"
                onClick={() => navigate("/signin")}
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}