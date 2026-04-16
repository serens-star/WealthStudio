import { NavLink } from "react-router-dom";
import "./SideBar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Tracks", to: "/tracks" },
  { label: "Simulate", to: "/simulate" },
  { label: "Learn", to: "/learn" },
  { label: "Profile", to: "/profile" },
];

export default function SideBar() {
  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">NW</span>
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
