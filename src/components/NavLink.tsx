import { NavLink as RouterNavLink } from "react-router-dom";
import React from "react";  // Importiere den NavLink von react-router-dom

interface NavLinkProps {
    section: string;
    label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ section, label }) => {
    return (
        <RouterNavLink
            to={`/${section}`} // Verwendet den React Router Link
            className="text-green-700 hover:text-green-900 transition-colors"
        >
            {label}
        </RouterNavLink>
    );
};

export default NavLink;