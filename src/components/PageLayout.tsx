// src/components/PageLayout.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavLink from "./NavLink.tsx";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  [k: string]: any;
};

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  logo: React.ReactNode;
  actions?: React.ReactNode; // optional: extra-Buttons rechts im Header
}

export default function PageLayout({ children, title, logo, actions }: PageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const loadUser = () => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  };

  // 1) Beim Mount laden
  useEffect(() => {
    loadUser();
  }, []);

  // 2) Bei Route-Wechsel neu lesen (gleicher Tab)
  useEffect(() => {
    loadUser();
  }, [location.key]);

  // 3) Auf Änderungen zwischen Tabs + Custom-Event im selben Tab reagieren
  useEffect(() => {
    const onChange = () => loadUser();
    window.addEventListener("storage", onChange);
    window.addEventListener("userChanged", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("userChanged", onChange);
    };
  }, []);

  // 4) Dropdown bei Klick außerhalb schließen
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setUser(null);
    // sofortiges Update auch im gleichen Tab auslösen
    window.dispatchEvent(new Event("userChanged"));
    navigate("/", { replace: true });
  };

  const links = [
    { section: "", label: "Home" },
    { section: "shop", label: "Shop" },
    { section: "about", label: "About" },
    { section: "contact", label: "Contact" },
  ];

  const displayName = user?.firstName?.trim()
    ? user.firstName
    : (user?.email ?? "Konto");

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">{logo}</div>
              <h1 className="text-2xl font-bold text-green-800">{title}</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <NavLink key={link.section} section={link.section} label={link.label} />
              ))}

              {/* Rechts: Sign In ODER Name + Dropdown */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-md border border-green-300 px-3 py-1.5 text-sm text-green-800 hover:bg-green-50"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    Hallo, {displayName}
                    <svg
                      className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-48 rounded-lg border border-green-200 bg-white shadow-lg overflow-hidden z-50"
                    >
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                        className="w-full text-left px-4 py-2 text-sm text-green-800 hover:bg-green-50"
                        role="menuitem"
                      >
                        Profil
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Direkt /login statt /signin
                <NavLink section="login" label="Sign In" />
              )}

              {/* optionale Zusatz-Actions rechts */}
              {actions && <div className="ml-2">{actions}</div>}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto">{children}</main>
    </div>
  );
}