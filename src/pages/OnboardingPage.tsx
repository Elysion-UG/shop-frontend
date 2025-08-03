"use client"

import { useState } from "react"
import { Leaf, Heart, Recycle, User, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from "lucide-react"

const sustainabilityFilters = {
    bio: {
        label: "Bio/Organic",
        icon: Leaf,
        description: "Products made from organic materials without harmful chemicals",
        examples: "Organic cotton, natural ingredients, chemical-free production",
    },
    "ethical-work": {
        label: "Ethical Work Enforced",
        icon: Heart,
        description: "Fair wages and safe working conditions guaranteed",
        examples: "Fair trade certified, worker rights protection, living wages",
    },
    "co2-neutral": {
        label: "CO2 Neutral",
        icon: Recycle,
        description: "Carbon footprint offset through verified programs",
        examples: "Carbon offset programs, renewable energy, climate positive",
    },
    "fair-trade": {
        label: "Fair Trade",
        icon: Heart,
        description: "Fair trade certified supply chain",
        examples: "Fair trade certification, ethical sourcing, community support",
    },
    recyclable: {
        label: "Recyclable Packaging",
        icon: Recycle,
        description: "100% recyclable or biodegradable packaging",
        examples: "Cardboard packaging, biodegradable materials, minimal waste",
    },
    "locally-sourced": {
        label: "Locally Sourced",
        icon: Leaf,
        description: "Materials sourced within 500km radius",
        examples: "Local suppliers, reduced transport, community economy",
    },
    vegan: {
        label: "Vegan",
        icon: Leaf,
        description: "No animal products or testing involved",
        examples: "Plant-based materials, cruelty-free, no animal testing",
    },
    "plastic-free": {
        label: "Plastic-Free",
        icon: Recycle,
        description: "Zero plastic in product and packaging",
        examples: "Glass containers, paper packaging, natural materials",
    },
}

const importanceScale = [
    { value: "1", label: "Not Important", color: "text-gray-500" },
    { value: "2", label: "Somewhat Important", color: "text-yellow-600" },
    { value: "3", label: "Important", color: "text-orange-600" },
    { value: "4", label: "Very Important", color: "text-green-600" },
]

// Erstelle einen Typ für die Nachhaltigkeitsbewertungen
type SustainabilityImportance = {
    [key: string]: string;  // Schlüssel sind Strings (die Attribute) und die Werte sind Strings (die Wichtigkeit)
}

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1)
    const [accountData, setAccountData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        newsletter: true,
    })

    const [sustainabilityImportance, setSustainabilityImportance] = useState<SustainabilityImportance>(
        Object.keys(sustainabilityFilters).reduce(
            (acc, key) => ({
                ...acc,
                [key]: "1",
            }),
            {},
        ),
    )

    const calculatePreferenceSummary = () => {
        const priorities = Object.entries(sustainabilityImportance)
            .filter(([, importance]) => {
                // Verwende key innerhalb der Filterbedingung
                const importanceValue = Number.parseInt(importance)
                return importanceValue >= 3  // Wenn die Bedeutung >= 3 ist
            })
            .sort((a, b) => {
                const importanceA = Number.parseInt(a[1])
                const importanceB = Number.parseInt(b[1])
                return importanceB - importanceA  // Sortiere absteigend nach Bedeutung
            })
            .slice(0, 3) // Nimm die Top 3 Ergebnisse

        // Mappe die Schlüsselnamen auf die Labels von sustainabilityFilters
        return priorities.map(([key]) => sustainabilityFilters[key as keyof typeof sustainabilityFilters]?.label || key)
    }

    const handleAccountDataChange = (field: string, value: string | boolean) => {
        setAccountData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImportanceChange = (attribute: string, importance: string) => {
        setSustainabilityImportance((prev) => ({
            ...prev,
            [attribute]: importance,
        }))
    }

    const isStep1Valid = () => {
        return (
            accountData.firstName &&
            accountData.lastName &&
            accountData.email &&
            accountData.password &&
            accountData.confirmPassword &&
            accountData.password === accountData.confirmPassword &&
            accountData.agreeToTerms
        )
    }

    const getProgressPercentage = () => {
        switch (currentStep) {
            case 1:
                return 33
            case 2:
                return 66
            case 3:
                return 100
            default:
                return 0
        }
    }

    const handleCreateAccount = () => {
        // Here you would typically send the data to your backend
        console.log("Account Data:", accountData)
        console.log("Sustainability Preferences:", sustainabilityImportance)
        setCurrentStep(3)
    }

    const handleStartShopping = () => {
        console.log("Navigate to shop")
    }

    return (
        <div className="min-h-screen bg-green-50">
            {/* Removed Header from here */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-700">Step {currentStep} of 3</span>
                            <span className="text-sm text-green-600">{getProgressPercentage()}% Complete</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full w-full flex-1 bg-green-600 transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${100 - getProgressPercentage()}%)` }}
                            />
                        </div>
                    </div>

                    {/* Step 1: Account Information */}
                    {currentStep === 1 && (
                        <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-green-800">
                                    <User className="w-6 h-6" />
                                    Create Your Account
                                </h3>
                                <p className="text-green-600">Let's start with your basic information</p>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            value={accountData.firstName}
                                            onChange={(e) => handleAccountDataChange("firstName", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-green-500"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            value={accountData.lastName}
                                            onChange={(e) => handleAccountDataChange("lastName", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 focus:border-green-500"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={accountData.email}
                                            onChange={(e) => handleAccountDataChange("email", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 focus:border-green-500"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={accountData.password}
                                            onChange={(e) => handleAccountDataChange("password", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 focus:border-green-500"
                                            placeholder="Create a secure password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={accountData.confirmPassword}
                                            onChange={(e) => handleAccountDataChange("confirmPassword", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 focus:border-green-500"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    {accountData.password &&
                                        accountData.confirmPassword &&
                                        accountData.password !== accountData.confirmPassword && (
                                            <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                                        )}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={accountData.agreeToTerms}
                                            onChange={(e) => handleAccountDataChange("agreeToTerms", e.target.checked)}
                                            className="peer h-4 w-4 shrink-0 rounded-sm border border-green-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-green-600 checked:text-white"
                                        />
                                        <span className="text-sm text-green-700">
                      I agree to the{" "}
                                            <a href="#" className="text-green-800 hover:text-green-900 underline">
                        Terms of Service
                      </a>{" "}
                                            and{" "}
                                            <a href="#" className="text-green-800 hover:text-green-900 underline">
                        Privacy Policy
                      </a>
                    </span>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={accountData.newsletter}
                                            onChange={(e) => handleAccountDataChange("newsletter", e.target.checked)}
                                            className="peer h-4 w-4 shrink-0 rounded-sm border border-green-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-green-600 checked:text-white"
                                        />
                                        <span className="text-sm text-green-700">
                      Send me updates about new sustainable products and eco-friendly tips
                    </span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => setCurrentStep(2)}
                                    disabled={!isStep1Valid()}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Continue to Preferences
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Sustainability Preferences */}
                    {currentStep === 2 && (
                        <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-green-800">
                                    <Sparkles className="w-6 h-6" />
                                    Your Sustainability Preferences
                                </h3>
                                <p className="text-green-600">
                                    Help us personalize your shopping experience by rating how important each sustainability aspect is to
                                    you
                                </p>
                            </div>
                            <div className="p-6 pt-0 space-y-8">
                                {Object.entries(sustainabilityFilters).map(([key, filter]) => {
                                    const Icon = filter.icon
                                    return (
                                        <div key={key} className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                            <div className="flex items-start gap-3">
                                                <Icon className="w-5 h-5 text-green-600 mt-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-green-800 mb-1">{filter.label}</h3>
                                                    <p className="text-sm text-green-600 mb-2">{filter.description}</p>
                                                    <p className="text-xs text-green-500 italic">Examples: {filter.examples}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800 mb-3 block">
                                                    How important is this to you?
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {importanceScale.map((scale) => (
                                                        <div key={scale.value} className="flex items-center space-x-2">
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
                                                                className={`text-sm cursor-pointer ${scale.color}`}
                                                            >
                                                                {scale.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 flex-1 border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </button>
                                    <button
                                        onClick={handleCreateAccount}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Completion */}
                    {currentStep === 3 && (
                        <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
                            <div className="flex flex-col space-y-1.5 p-6 text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold leading-none tracking-tight text-green-800 text-2xl">
                                    Welcome to EcoShop!
                                </h3>
                                <p className="text-green-600">
                                    Your account has been created and your sustainability preferences have been saved.
                                </p>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">Your Top Sustainability Priorities:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {calculatePreferenceSummary().map((priority, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm border border-green-300"
                                            >
                        {priority}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-green-700">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Products will be ranked based on your preferences</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>You'll see detailed sustainability match scores</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Personalized recommendations await you</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 flex-1 border border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                                    >
                                        Adjust Preferences
                                    </button>
                                    <button
                                        onClick={handleStartShopping}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Start Shopping
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}