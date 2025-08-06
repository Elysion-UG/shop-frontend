"use client"

import React, { useState } from "react"
import { ArrowLeft, Leaf, Heart, Recycle, Check, X, Star, ShoppingCart, Plus, Minus, AlertTriangle } from "lucide-react"

const product: Product =
{
    id: 1,
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton, ethically made in fair trade certified facilities",
    longDescription:
        "This premium organic cotton t-shirt is crafted from GOTS-certified organic cotton, ensuring no harmful chemicals were used in its production. Made in fair trade certified facilities that guarantee fair wages and safe working conditions for all workers. The production process is carbon neutral, and the packaging is 100% recyclable. Note: While our packaging is recyclable, it does contain some plastic components for product protection during shipping.",
    price: 29.99,
    originalPrice: 39.99,
    category: "Clothing",
    images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&sat=-100",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&brightness=110",
    ],
    attributes: ["bio", "ethical-work", "co2-neutral", "recyclable"], // Note: missing "plastic-free" and "locally-sourced"
    rating: 4.8,
    reviews: 124,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Forest Green"]
}

type SustainabilityFilter = {
    label: string;
    icon: React.ElementType;
    description: string;
};

const sustainabilityFilters: Record<string, SustainabilityFilter> = {
    bio: { label: "Bio/Organic", icon: Leaf, description: "Made from organic materials without harmful chemicals" },
    "ethical-work": {
        label: "Ethical Work Enforced",
        icon: Heart,
        description: "Fair wages and safe working conditions guaranteed",
    },
    "co2-neutral": {
        label: "CO2 Neutral",
        icon: Recycle,
        description: "Carbon footprint offset through verified programs",
    },
    "fair-trade": { label: "Fair Trade", icon: Heart, description: "Fair trade certified supply chain" },
    recyclable: {
        label: "Recyclable Packaging",
        icon: Recycle,
        description: "100% recyclable or biodegradable packaging",
    },
    "locally-sourced": { label: "Locally Sourced", icon: Leaf, description: "Materials sourced within 500km radius" },
    vegan: { label: "Vegan", icon: Leaf, description: "No animal products or testing involved" },
    "plastic-free": { label: "Plastic-Free", icon: Recycle, description: "Zero plastic in product and packaging" },
}

const importanceScale = [
    { value: "1", label: "Not Important" },
    { value: "2", label: "Somewhat Important" },
    { value: "3", label: "Important" },
    { value: "4", label: "Very Important" },
]

type Product = {
    id: number;
    name: string;
    description: string;
    longDescription: string;
    price: number;
    originalPrice: number;
    category: string;
    images: string[];
    attributes: string[];
    rating: number;
    reviews: number;
    inStock: boolean;
    sizes: string[];
    colors: string[];
};


export default function ProductDetail() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)

    // Initialize sustainability importance ratings with some defaults to show negative scoring
    const [sustainabilityImportance, setSustainabilityImportance] = useState<Record<string, string>>(
        Object.keys(sustainabilityFilters).reduce(
            (acc, key) => ({
                ...acc,
                [key]: "1",  // Default-Wert auf "1" setzen (Not Important)
            }),
            {}
        )
    )

    const handleImportanceChange = (attribute: string, importance: string) => {
        setSustainabilityImportance((prev) => ({
            ...prev,
            [attribute]: importance,
        }))
    }

    const handleBackClick = () => {
        console.log("Navigate back to shop")
        // Here you would navigate back to shop
    }

    // Calculate match score with penalty system
    const calculateMatch = () => {
        let positiveScore = 0
        let negativeScore = 0
        let totalPossibleScore = 0

        Object.entries(sustainabilityImportance).forEach(([attribute, importance]) => {
            const importanceValue = Number.parseInt(importance)

            if (importanceValue > 1) {
                // Only count if somewhat important or higher
                totalPossibleScore += importanceValue

                if (product.attributes.includes(attribute)) {
                    positiveScore += importanceValue
                } else {
                    // Subtract points for missing important attributes
                    negativeScore += importanceValue
                }
            }
        })

        const netScore = positiveScore - negativeScore
        const matchPercentage = totalPossibleScore > 0 ? Math.max(0, (positiveScore / totalPossibleScore) * 100) : 0

        return {
            positiveScore,
            negativeScore,
            netScore,
            totalPossibleScore,
            matchPercentage,
        }
    }

    const { positiveScore, negativeScore, matchPercentage } = calculateMatch()

    const getMatchColor = (percentage: number) => {
        if (percentage >= 80) return "text-green-600"
        if (percentage >= 60) return "text-yellow-600"
        if (percentage >= 40) return "text-orange-600"
        return "text-red-600"
    }

    const getAttributeIcon = (attribute: string) => {
        const filter = sustainabilityFilters[attribute]
        if (filter) {
            const Icon = filter.icon
            return <Icon className="w-4 h-4" />
        }
        return null
    }

    return (
        <div className="min-h-screen bg-green-50">
            {/* Header */}
            <header className="bg-white border-b border-green-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBackClick} className="flex items-center gap-2 text-green-700 hover:text-green-900">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Shop
                            </button>
                            <div className="flex items-center gap-2">
                                <Leaf className="w-8 h-8 text-green-600" />
                                <h1 className="text-2xl font-bold text-green-800">EcoShop</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg border border-green-200 overflow-hidden">
                            <img
                                src={product.images[selectedImage] || "/placeholder.svg"}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-20 bg-white rounded-lg border-2 overflow-hidden ${
                                        selectedImage === index ? "border-green-500" : "border-green-200"
                                    }`}
                                >
                                    <img
                                        src={image || "/placeholder.svg"}
                                        alt={`${product.name} ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-300 mb-2">
                {product.category}
              </span>
                            <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
                            <p className="text-green-600 mb-4">{product.description}</p>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-800">${product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-green-600">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-semibold">{product.rating}</span>
                                    <span className="text-sm">({product.reviews} reviews)</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.attributes.map((attribute) => (
                                    <span
                                        key={attribute}
                                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-xs border-green-300 text-green-700"
                                    >
                    <span className="flex items-center gap-1">
                      {getAttributeIcon(attribute)}
                        {sustainabilityFilters[attribute]?.label}
                    </span>
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <label className="text-sm font-medium text-green-800 mb-2 block">Size</label>
                            <div className="flex gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 ${
                                            selectedSize === size
                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                : "border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="text-sm font-medium text-green-800 mb-2 block">Color</label>
                            <div className="flex gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 ${
                                            selectedColor === color
                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                : "border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="text-sm font-medium text-green-800 mb-2 block">Quantity</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={!selectedSize || !selectedColor}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </button>
                    </div>
                </div>

                {/* Sustainability Match Analysis */}
                <div className="mt-12">
                    <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-green-800">
                                <Leaf className="w-6 h-6" />
                                Sustainability Match Analysis
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-700">Overall Match</span>
                                        <span className={`text-sm font-bold ${getMatchColor(matchPercentage)}`}>
                      {Math.round(matchPercentage)}%
                    </span>
                                    </div>
                                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full w-full flex-1 bg-green-600 transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${100 - (matchPercentage || 0)}%)` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-800">{positiveScore}</div>
                                    <div className="text-sm text-green-600">earned points</div>
                                    {negativeScore > 0 && (
                                        <>
                                            <div className="text-lg font-bold text-red-600">-{negativeScore}</div>
                                            <div className="text-xs text-red-600">missing points</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {negativeScore > 0 && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                      This product is missing {negativeScore} points from your important sustainability criteria
                    </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 pt-0">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Your Preferences */}
                                <div>
                                    <h3 className="font-semibold text-green-800 mb-4">Your Sustainability Preferences</h3>
                                    <div className="space-y-4">
                                        {Object.entries(sustainabilityFilters).map(([key, filter]) => {
                                            const Icon = filter.icon
                                            return (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-green-800">{filter.label}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {importanceScale.map((scale) => (
                                                            <div key={scale.value} className="flex items-center space-x-1">
                                                                <input
                                                                    type="radio"
                                                                    value={scale.value}
                                                                    id={`${key}-${scale.value}`}
                                                                    checked={sustainabilityImportance[key] === scale.value}
                                                                    onChange={() => handleImportanceChange(key, scale.value)}
                                                                    className="aspect-square h-4 w-4 rounded-full border border-green-300 text-green-600"
                                                                />
                                                                <label
                                                                    htmlFor={`${key}-${scale.value}`}
                                                                    className="text-xs text-green-700 cursor-pointer"
                                                                >
                                                                    {scale.value}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Product Match Breakdown */}
                                <div>
                                    <h3 className="font-semibold text-green-800 mb-4">How This Product Matches</h3>
                                    <div className="space-y-4">
                                        {Object.entries(sustainabilityFilters).map(([key, filter]) => {
                                            const Icon = filter.icon
                                            const hasAttribute = product.attributes.includes(key)
                                            const importance = Number.parseInt(sustainabilityImportance[key])
                                            const points = hasAttribute ? importance : importance > 1 ? -importance : 0
                                            const isImportant = importance > 1

                                            return (
                                                <div
                                                    key={key}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                        !hasAttribute && isImportant
                                                            ? "bg-red-50 border-red-200"
                                                            : hasAttribute && isImportant
                                                                ? "bg-green-50 border-green-200"
                                                                : "bg-gray-50 border-gray-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Icon className="w-4 h-4 text-green-600" />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-medium text-green-800">{filter.label}</span>
                                                                {hasAttribute ? (
                                                                    <Check className="w-4 h-4 text-green-600" />
                                                                ) : isImportant ? (
                                                                    <X className="w-4 h-4 text-red-500" />
                                                                ) : (
                                                                    <X className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-green-600">{filter.description}</p>
                                                            {!hasAttribute && isImportant && (
                                                                <p className="text-xs text-red-600 mt-1 font-medium">Missing important feature</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div
                                                            className={`text-sm font-bold ${
                                                                points > 0 ? "text-green-600" : points < 0 ? "text-red-600" : "text-gray-500"
                                                            }`}
                                                        >
                                                            {points > 0 ? `+${points}` : points < 0 ? `${points}` : "0"}
                                                        </div>
                                                        <div className="text-xs text-green-600">points</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-8">
                    <div className="w-full">
                        <div className="grid w-full grid-cols-3 bg-green-100 rounded-md p-1">
                            <button
                                onClick={() => console.log("Details tab clicked")}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm bg-white"
                            >
                                Details
                            </button>
                            <button
                                onClick={() => console.log("Sustainability tab clicked")}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                            >
                                Sustainability
                            </button>
                            <button
                                onClick={() => console.log("Reviews tab clicked")}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                            >
                                Reviews
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                                <div className="p-6 pt-6">
                                    <p className="text-green-700 leading-relaxed">{product.longDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}