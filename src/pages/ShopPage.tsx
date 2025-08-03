"use client"

import React, { useState, useMemo } from "react"
import { Leaf, Heart, Recycle, ArrowUpDown, Star, ChevronDown } from "lucide-react"

const products = [
    {
        id: 1,
        name: "Organic Cotton T-Shirt",
        description: "100% organic cotton, ethically made",
        price: 29.99,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        attributes: ["bio", "ethical-work", "co2-neutral"],
        rating: 4.8,
        reviews: 124,
    },
    {
        id: 2,
        name: "Bamboo Toothbrush Set",
        description: "Biodegradable bamboo toothbrushes",
        price: 12.99,
        category: "Personal Care",
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
        attributes: ["bio", "plastic-free", "recyclable"],
        rating: 4.6,
        reviews: 89,
    },
    {
        id: 3,
        name: "Fair Trade Coffee Beans",
        description: "Single origin, ethically sourced",
        price: 18.5,
        category: "Food & Beverages",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
        attributes: ["fair-trade", "ethical-work", "locally-sourced"],
        rating: 4.9,
        reviews: 203,
    },
    {
        id: 4,
        name: "Recycled Yoga Mat",
        description: "Made from recycled ocean plastic",
        price: 45.0,
        category: "Sports & Fitness",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        attributes: ["recyclable", "co2-neutral", "plastic-free"],
        rating: 4.7,
        reviews: 156,
    },
    {
        id: 5,
        name: "Vegan Leather Wallet",
        description: "Cruelty-free alternative leather",
        price: 35.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        attributes: ["vegan", "ethical-work", "recyclable"],
        rating: 4.5,
        reviews: 78,
    },
    {
        id: 6,
        name: "Solar Power Bank",
        description: "Renewable energy charging solution",
        price: 42.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop",
        attributes: ["co2-neutral", "recyclable"],
        rating: 4.4,
        reviews: 92,
    },
    {
        id: 7,
        name: "Organic Honey",
        description: "Raw, unprocessed local honey",
        price: 15.99,
        category: "Food & Beverages",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
        attributes: ["bio", "locally-sourced", "plastic-free"],
        rating: 4.8,
        reviews: 167,
    },
    {
        id: 8,
        name: "Hemp Backpack",
        description: "Durable hemp fiber construction",
        price: 68.0,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        attributes: ["bio", "ethical-work", "recyclable"],
        rating: 4.6,
        reviews: 134,
    },
]

type SustainabilityFilter = {
    label: string;
    icon: React.ElementType;
};

const sustainabilityFilters: { [key: string]: SustainabilityFilter } = {
    "bio": { label: "Bio/Organic", icon: Leaf },
    "ethical-work": { label: "Ethical Work Enforced", icon: Heart },
    "co2-neutral": { label: "CO2 Neutral", icon: Recycle },
    "fair-trade": { label: "Fair Trade", icon: Heart },
    "recyclable": { label: "Recyclable Packaging", icon: Recycle },
    "locally-sourced": { label: "Locally Sourced", icon: Leaf },
    "vegan": { label: "Vegan", icon: Leaf },
    "plastic-free": { label: "Plastic-Free", icon: Recycle },
}

const categories = ["Clothing", "Personal Care", "Food & Beverages", "Sports & Fitness", "Accessories", "Electronics"]

const importanceScale = [
    { value: "1", label: "Not Important" },
    { value: "2", label: "Somewhat Important" },
    { value: "3", label: "Important" },
    { value: "4", label: "Very Important" },
]

export default function SustainableShop() {
    const [selectedFilters, setSelectedFilters] = useState<{ category: string[] }>({
        category: [],
    })

    const [sustainabilityImportance, setSustainabilityImportance] = useState<Record<string, string>>(
        Object.keys(sustainabilityFilters).reduce(
            (acc, key) => ({
                ...acc,
                [key]: "1",
            }),
            {},
        ),
    )

    const [sortBy, setSortBy] = useState("relevance")
    const [openAccordion, setOpenAccordion] = useState({ sustainability: true, category: true })
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

    const handleCategoryFilterChange = (category: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            category: prev.category.includes(category)
                ? prev.category.filter((item) => item !== category)
                : [...prev.category, category],
        }))
    }

    const handleImportanceChange = (attribute: string, importance: string) => {
        setSustainabilityImportance((prev) => ({
            ...prev,
            [attribute]: importance,
        }))
    }

    const toggleAccordion = (key: "sustainability" | "category") => {
        setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(product.category)) {
                    return false
                }
                return true
            })
            .map((product) => {
                let matchScore = 0
                let totalPossibleScore = 0

                Object.entries(sustainabilityImportance).forEach(([attribute, importance]) => {
                    const importanceValue = Number.parseInt(importance)
                    totalPossibleScore += importanceValue

                    if (product.attributes.includes(attribute)) {
                        matchScore += importanceValue
                    }
                })

                const matchPercentage = totalPossibleScore > 0 ? (matchScore / totalPossibleScore) * 100 : 0

                return {
                    ...product,
                    matchScore,
                    matchPercentage,
                }
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "relevance":
                        if (b.matchScore !== a.matchScore) {
                            return b.matchScore - a.matchScore
                        }
                        return b.rating - a.rating
                    case "price-low":
                        return a.price - b.price
                    case "price-high":
                        return b.price - a.price
                    case "rating":
                        return b.rating - a.rating
                    case "newest":
                        return b.id - a.id
                    default:
                        return b.matchScore - a.matchScore
                }
            })
    }, [selectedFilters, sustainabilityImportance, sortBy])

    const getAttributeIcon = (attribute: string) => {
        const filter = sustainabilityFilters[attribute]
        if (filter) {
            const Icon = filter.icon
            return <Icon className="w-3 h-3" />
        }
        return null
    }

    const getAttributeLabel = (attribute: string) => {
        return sustainabilityFilters[attribute]?.label || attribute
    }

    const getMatchColor = (percentage: number) => {
        if (percentage >= 80) return "bg-green-100 text-green-800 border-green-300"
        if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300"
        if (percentage >= 40) return "bg-orange-100 text-orange-800 border-orange-300"
        return "bg-gray-100 text-gray-800 border-gray-300"
    }

    const handleProductClick = (productId: number) => {
        console.log(`Navigate to product ${productId}`)
        // Here you would navigate to product detail page
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-[320px_1fr] gap-8">
                {/* Filters Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
                        <h2 className="font-semibold text-green-800 mb-4">Preferences</h2>

                        {/* Sustainability Importance Accordion */}
                        <div className="border-b border-green-200">
                            <button
                                className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-green-700 hover:text-green-900 w-full"
                                onClick={() => toggleAccordion("sustainability")}
                                aria-expanded={openAccordion.sustainability}
                                aria-controls="sustainability-content"
                            >
                                Sustainability Importance
                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordion.sustainability ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openAccordion.sustainability && (
                                <div id="sustainability-content" className="pb-4 pt-0 animate-accordion-down">
                                    <div className="space-y-6">
                                        <p className="text-sm text-green-600 mb-4">
                                            Rate how important each sustainability aspect is to you:
                                        </p>
                                        {Object.entries(sustainabilityFilters).map(([key, filter]) => {
                                            const Icon = filter.icon
                                            return (
                                                <div key={key} className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-green-800">{filter.label}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {importanceScale.map((scale) => (
                                                            <div key={scale.value} className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    value={scale.value}
                                                                    id={`${key}-${scale.value}`}
                                                                    name={`importance-${key}`}
                                                                    checked={sustainabilityImportance[key] === scale.value}
                                                                    onChange={() => handleImportanceChange(key, scale.value)}
                                                                    className="aspect-square h-4 w-4 rounded-full border border-green-300 text-green-600 focus:ring-2 focus:ring-green-500"
                                                                />
                                                                <label
                                                                    htmlFor={`${key}-${scale.value}`}
                                                                    className="text-xs text-green-700 cursor-pointer"
                                                                >
                                                                    {scale.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Accordion */}
                        <div className="border-b border-green-200">
                            <button
                                className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-green-700 hover:text-green-900 w-full"
                                onClick={() => toggleAccordion("category")}
                                aria-expanded={openAccordion.category}
                                aria-controls="category-content"
                            >
                                Category
                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordion.category ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openAccordion.category && (
                                <div id="category-content" className="pb-4 pt-0 animate-accordion-down">
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <label key={category} className="flex items-center gap-3 font-normal cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.category.includes(category)}
                                                    onChange={() => handleCategoryFilterChange(category)}
                                                    className="peer h-4 w-4 shrink-0 rounded-sm border border-green-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-green-600 checked:text-white"
                                                />
                                                <span className="text-sm">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="space-y-6">
                    {/* Header with Sort */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-green-800">Sustainable Products</h2>
                                <p className="text-green-600 mt-1">{filteredProducts.length} products ranked by your preferences</p>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                    aria-haspopup="true"
                                    aria-expanded={isSortDropdownOpen}
                                >
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    Sort by
                                </button>
                                {isSortDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-[200px] rounded-md border bg-white p-1 text-gray-900 shadow-md z-50">
                                        <button
                                            onClick={() => {
                                                setSortBy("relevance")
                                                setIsSortDropdownOpen(false)
                                            }}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 ${sortBy === "relevance" ? "bg-green-50 text-green-700" : ""}`}
                                        >
                                            Best Match
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("rating")
                                                setIsSortDropdownOpen(false)
                                            }}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 ${sortBy === "rating" ? "bg-green-50 text-green-700" : ""}`}
                                        >
                                            Highest Rated
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("price-low")
                                                setIsSortDropdownOpen(false)
                                            }}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 ${sortBy === "price-low" ? "bg-green-50 text-green-700" : ""}`}
                                        >
                                            Price: Low to High
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("price-high")
                                                setIsSortDropdownOpen(false)
                                            }}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 ${sortBy === "price-high" ? "bg-green-50 text-green-700" : ""}`}
                                        >
                                            Price: High to Low
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("newest")
                                                setIsSortDropdownOpen(false)
                                            }}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 ${sortBy === "newest" ? "bg-green-50 text-green-700" : ""}`}
                                        >
                                            Newest
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <a href="#" onClick={() => handleProductClick(product.id)} className="block">
                                    <div className="relative">
                                        <img
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-300">
                      {product.category}
                    </span>
                                            {product.matchPercentage > 0 && (
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getMatchColor(product.matchPercentage)}`}
                                                >
                        {Math.round(product.matchPercentage)}% match
                      </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-green-800 mb-2">{product.name}</h3>
                                        <p className="text-sm text-green-600 mb-3">{product.description}</p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {product.attributes.map((attribute) => (
                                                <span
                                                    key={attribute}
                                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-green-300 text-green-700"
                                                >
                        <span className="flex items-center gap-1">
                          {getAttributeIcon(attribute)}
                            {getAttributeLabel(attribute)}
                        </span>
                      </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-green-800">${product.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-green-600">
                                                <Star className="w-4 h-4 fill-current text-yellow-400" />
                                                <span>{product.rating}</span>
                                                <span>({product.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-green-200">
                            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-800 mb-2">No products found</h3>
                            <p className="text-green-600">Try adjusting your category filters to see more sustainable products.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}