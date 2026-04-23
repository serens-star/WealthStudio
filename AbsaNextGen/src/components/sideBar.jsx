import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./SideBar.css";

const navItems = [
  { label: "Home", to: "/", icon: "⊞" },
  { label: "Tracks", to: "/tracks", icon: "◎" },
  { label: "Simulate", to: "/simulate", icon: "⟳" },
  { label: "Learn", to: "/learn", icon: "◈" },
  { label: "Profile", to: "/profile", icon: "◉" },
];

export default function SideBar({ onLogout }) {
  const { user } = useUser();

  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">NW</div>
        <span className="sidebar__brand-name">NextGen Wealth</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">{user?.initials || "U"}</div>
          <span className="sidebar__user-name">{user?.name || "User"}</span>
        </div>
        <button className="sidebar__logout" onClick={onLogout}>
          <span className="sidebar__link-icon">→</span>
          Log out
        </button>
      </div>
    </div>
  );
}
