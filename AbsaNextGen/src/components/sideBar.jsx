import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Home,
  TrendingUp,
  FlaskConical,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import "./SideBar.css";

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Tracks", to: "/tracks", icon: TrendingUp },
  { label: "Simulate", to: "/simulate", icon: FlaskConical },
  { label: "Learn", to: "/learn", icon: BookOpen },
  { label: "Profile", to: "/profile", icon: User },
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
            <item.icon size={16} className="sidebar__link-icon" />
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
          <LogOut size={16} className="sidebar__link-icon" />
          Log out
        </button>
      </div>
    </div>
  );
}
