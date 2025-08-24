import { NavLink as RouterNavLink } from "react-router-dom";
import React from "react";

interface NavLinkProps {
  section: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ section, label }) => {
  return (
    <RouterNavLink
      to={`/${section}`}
      className={({ isActive }) =>
        `transition-colors ${
          isActive ? "text-green-900 underline" : "text-green-700 hover:text-green-900"
        }`
      }
    >
      {label}
    </RouterNavLink>
  );
};

export default NavLink;