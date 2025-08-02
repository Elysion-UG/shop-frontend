"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Leaf, CheckCircle, Mail, ArrowRight, RefreshCw } from "lucide-react"

export default function EmailVerification() {
    const [isVerified, setIsVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")

        if (!token) {
            setIsLoading(false)
            setIsVerified(false)
            return
        }

        fetch(`http://100.66.219.89:8080/users/confirm-email-change?token=${token}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Verification failed")
                }
                return res.json()
            })
            .then(() => {
                setIsVerified(true)
            })
            .catch((err) => {
                console.error("Verification error:", err)
                setIsVerified(false)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const handleResendEmail = () => {
        // Here you would typically call your backend to resend verification email
        console.log("Resending verification email...")
    }

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault()
        console.log(`Navigate to ${section}`)
    }

    const handleStartShopping = () => {
        console.log("Navigate to shop")
    }

    return (
        <div className="min-h-screen bg-green-50">
            {/* Header */}
            <header className="bg-white border-b border-green-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-8 h-8 text-green-600" />
                            <h1 className="text-2xl font-bold text-green-800">EcoShop</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" onClick={(e) => handleNavClick(e, "home")} className="text-green-700 hover:text-green-900">
                                Home
                            </a>
                            <a href="#" onClick={(e) => handleNavClick(e, "shop")} className="text-green-700 hover:text-green-900">
                                Shop
                            </a>
                            <a href="#" onClick={(e) => handleNavClick(e, "about")} className="text-green-700 hover:text-green-900">
                                About
                            </a>
                            <a href="#" onClick={(e) => handleNavClick(e, "contact")} className="text-green-700 hover:text-green-900">
                                Contact
                            </a>
                            <a href="#" onClick={(e) => handleNavClick(e, "signin")} className="text-green-700 hover:text-green-900">
                                Sign In
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                        <div className="flex flex-col space-y-1.5 p-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                {isLoading ? (
                                    <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
                                ) : isVerified ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : (
                                    <Mail className="w-8 h-8 text-green-600" />
                                )}
                            </div>
                            <h3 className="font-semibold leading-none tracking-tight text-green-800 text-xl">
                                {isLoading ? "Verifying..." : isVerified ? "Email Verified!" : "Check Your Email"}
                            </h3>
                        </div>
                        <div className="p-6 pt-0 text-center space-y-4">
                            {isLoading && <p className="text-green-600">We're verifying your email address...</p>}

                            {!isLoading && isVerified && (
                                <>
                                    <p className="text-green-600">
                                        Great! Your email has been successfully verified. You can now access all features of EcoShop.
                                    </p>
                                    <button
                                        onClick={handleStartShopping}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Start Shopping
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </>
                            )}

                            {!isLoading && !isVerified && (
                                <>
                                    <p className="text-green-600">
                                        We've sent a verification link to your email address. Please check your inbox and click the link to
                                        verify your account.
                                    </p>
                                    <div className="space-y-3">
                                        <p className="text-sm text-green-500">Didn't receive the email?</p>
                                        <button
                                            onClick={handleResendEmail}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                        >
                                            Resend Verification Email
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}