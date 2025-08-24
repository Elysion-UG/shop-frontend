// src/components/PageLayout.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  actions?: React.ReactNode; // ✅ allow extra action elements
}

export default function PageLayout({ children, title, logo, actions }: PageLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    load();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const links = [
    { section: "", label: "Home" },
    { section: "shop", label: "Shop" },
    { section: "about", label: "About" },
    { section: "contact", label: "Contact" },
  ];

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

              {/* Rechts: Sign in ODER "Hallo, Name" + Logout */}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-green-800">
                    Hallo, {user.firstName || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center rounded-md border border-green-300 px-3 py-1.5 text-sm text-green-800 hover:bg-green-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink section="signin" label="Sign In" />
              )}

              {/* optional extra actions */}
              {actions && <div className="ml-4">{actions}</div>}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto">{children}</main>
    </div>
  );
}