import { NavLink } from "react-router-dom";
import "./MobileNav.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Tracks", to: "/tracks" },
  { label: "Simulate", to: "/simulate" },
  { label: "Learn", to: "/learn" },
  { label: "Profile", to: "/profile" },
];

export default function MobileNav() {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            isActive
              ? "mobile-nav__item mobile-nav__item--active"
              : "mobile-nav__item"
          }
        >
          <span className="mobile-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}
