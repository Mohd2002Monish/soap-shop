import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice.js";

const navItems = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/orders", icon: "📦", label: "Orders" },
  { path: "/products", icon: "🧼", label: "Products" },
  { path: "/categories", icon: "🏷️", label: "Categories" },
  { path: "/customers", icon: "👥", label: "Customers" },
];

const Sidebar = ({ open, onClose }) => {
  const { adminInfo } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.();
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? " open" : ""}`}
        onClick={onClose}
      />

      <div className={`sidebar${open ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌿</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Sterling Botanica</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>{adminInfo?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminInfo?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "none", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, width: "100%", transition: "all 0.2s" }}
            onMouseOver={e => e.target.style.background = "rgba(239,68,68,0.25)"}
            onMouseOut={e => e.target.style.background = "rgba(239,68,68,0.15)"}
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

const TopBar = ({ title, rightContent }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="topbar">
        {/* Hamburger — only visible on mobile via CSS */}
        <button
          className="topbar-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="topbar-title" style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          <div className="topbar-date" style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {rightContent}
          <div className="topbar-badge" style={{ background: "#f1f5f9", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>
            🌿 Admin
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar, TopBar };
