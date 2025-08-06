"use client"

import type React from "react"
import NavLink from "./NavLink.tsx";

interface PageLayoutProps {
    children: React.ReactNode
    title: string
    logo: React.ReactNode
}

export default function PageLayout({ children, title, logo }: PageLayoutProps) {
    const links = [
        { section: "", label: "Home" },
        { section: "shop", label: "Shop" },
        { section: "about", label: "About" },
        { section: "contact", label: "Contact" },
        { section: "signin", label: "Sign In" }
    ]

    return (
        <div className="min-h-screen bg-green-50">
            {/* Header */}
            <header className="bg-white border-b border-green-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8">
                                {logo}
                            </div>
                            <h1 className="text-2xl font-bold text-green-800">{title}</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            {links.map((link) => (
                                <NavLink
                                    key={link.section}
                                    section={link.section}
                                    label={link.label}
                                />
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto">{children}</main>
        </div>
    )
}