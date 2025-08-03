"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Leaf } from "lucide-react"

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Contact form submitted:", formData)
        // Here you would typically send the form data to a backend service
        alert("Thank you for your message! We will get back to you soon.")
        setFormData({ name: "", email: "", message: "" }) // Clear form
    }

    return (
        <div className="min-h-screen bg-green-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-8 space-y-8">
                    <div className="text-center">
                        <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-green-800 mb-2">Contact Us</h1>
                        <p className="text-green-600">We'd love to hear from you! Send us a message or find our details below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-green-800 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-1">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="john.doe@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-green-800 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                required
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                                placeholder="Type your message here..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-semibold"
                        >
                            Send Message
                        </button>
                    </form>

                    <div className="border-t border-green-100 pt-8 mt-8 space-y-4">
                        <h2 className="text-2xl font-bold text-green-800 text-center mb-4">Our Details</h2>
                        <div className="flex items-center gap-3 text-green-700">
                            <Mail className="w-5 h-5 text-green-600" />
                            <span>info@ecoshop.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-green-700">
                            <Phone className="w-5 h-5 text-green-600" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-start gap-3 text-green-700">
                            <MapPin className="w-5 h-5 text-green-600 mt-1" />
                            <span>
                123 Eco-Friendly Lane
                <br />
                Greenville, GA 30303
                <br />
                USA
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}