"use client"

import { Leaf, Recycle, Heart } from "lucide-react"

export default function About() {
    return (
        <div className="min-h-screen bg-green-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-8 space-y-8">
                    <div className="text-center">
                        <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-green-800 mb-2">About EcoShop</h1>
                        <p className="text-green-600">
                            Our mission is to make sustainable shopping easy and accessible for everyone.
                        </p>
                    </div>

                    <div className="space-y-6 text-green-700 leading-relaxed">
                        <p>
                            At EcoShop, we believe that every purchase has an impact. That's why we've created a platform dedicated to
                            helping you discover and choose products that align with your values. We carefully vet our suppliers and
                            products to ensure they meet high standards of sustainability, ethical production, and environmental
                            responsibility.
                        </p>
                        <p>
                            Our unique sustainability matching system allows you to personalize your shopping experience by
                            prioritizing what matters most to you, whether it's organic materials, fair labor practices, CO2
                            neutrality, or plastic-free packaging. We provide transparent information so you can make informed
                            decisions with confidence.
                        </p>
                        <p>
                            Join us in building a more sustainable future, one conscious purchase at a time. Thank you for being a
                            part of the EcoShop community!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center pt-4 border-t border-green-100">
                        <div className="space-y-2">
                            <Recycle className="w-8 h-8 text-green-600 mx-auto" />
                            <h3 className="font-semibold text-green-800">Eco-Friendly Products</h3>
                            <p className="text-sm text-green-600">Curated selection of sustainable goods.</p>
                        </div>
                        <div className="space-y-2">
                            <Heart className="w-8 h-8 text-green-600 mx-auto" />
                            <h3 className="font-semibold text-green-800">Ethical Sourcing</h3>
                            <p className="text-sm text-green-600">Supporting fair labor and responsible practices.</p>
                        </div>
                        <div className="space-y-2">
                            <Leaf className="w-8 h-8 text-green-600 mx-auto" />
                            <h3 className="font-semibold text-green-800">Transparent Information</h3>
                            <p className="text-sm text-green-600">Detailed sustainability insights for every product.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}