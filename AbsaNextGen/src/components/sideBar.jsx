import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./SideBar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Tracks", to: "/tracks" },
  { label: "Simulate", to: "/simulate" },
  { label: "Learn", to: "/learn" },
  { label: "Profile", to: "/profile" },
];

export default function SideBar() {
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
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">{user.initials}</div>
          <span className="sidebar__user-name">{user.name}</span>
        </div>
        <button
          className="sidebar__logout"
          onClick={() => {
            localStorage.removeItem("currentUser");
            window.location.href = "/login";
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
