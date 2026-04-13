import { NavLink } from "react-router-dom";
import "../styles/sideBar.css";

const navPages = [
  {
    label: "Money Snapshot",
    to: "/",
  },
  {
    label: "Tracks",
    to: "/Tracks",
  },
  {
    label: "Simulate",
    to: "/Simulation",
  },
  {
    label: "Learn",
    to: "/Learn",
  },
  {
    label: "Profile",
    to: "/Profile",
  },
];

export default function  SideBar() {
  return (
    <div className="sidebar">
      <h2>NGWS</h2>

      <nav>
        <ul>
          {navPages.map((page) => (
            <NavLink
              key={page.to}
              to={page.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {page.label}
            </NavLink>
          ))}
        </ul>
      </nav>
    </div>
  );
}
