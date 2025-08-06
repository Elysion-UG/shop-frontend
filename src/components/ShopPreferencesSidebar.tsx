import {ChevronDown, Heart, Leaf, Recycle} from "lucide-react";
import React, {useState} from "react";

type ShopPreferencesSidebarProps = {
    selectedFilters: { category: string[] }
    setSelectedFilters: React.Dispatch<React.SetStateAction<{ category: string[] }>>
    sustainabilityImportance: Record<string, string>
    setSustainabilityImportance: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export default function ShopPreferencesSidebar({
    selectedFilters,
    setSelectedFilters,
    sustainabilityImportance,
    setSustainabilityImportance,
}: ShopPreferencesSidebarProps) {

    type SustainabilityFilter = {
        icon: React.ComponentType<{ className?: string }>
        label: string
    }

    const sustainabilityFilters: Record<string, SustainabilityFilter>= {
        bio: { label: "Bio/Organic", icon: Leaf },
        "ethical-work": { label: "Ethical Work Enforced", icon: Heart },
        "co2-neutral": { label: "CO2 Neutral", icon: Recycle },
        "fair-trade": { label: "Fair Trade", icon: Heart },
        recyclable: { label: "Recyclable Packaging", icon: Recycle },
        "locally-sourced": { label: "Locally Sourced", icon: Leaf },
        vegan: { label: "Vegan", icon: Leaf },
        "plastic-free": { label: "Plastic-Free", icon: Recycle },
    }

    const importanceScale = [
        { value: "1", label: "Not Important" },
        { value: "2", label: "Somewhat Important" },
        { value: "3", label: "Important" },
        { value: "4", label: "Very Important" },
    ]

    const categories = ["Clothing", "Personal Care", "Food & Beverages", "Sports & Fitness", "Accessories", "Electronics"]

    const handleCategoryFilterChange = (category: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            category: prev.category.includes(category)
                ? prev.category.filter((item) => item !== category)
                : [...prev.category, category],
        }))
    }

    const getImportanceLabel = (value: string) => {
        return importanceScale.find((scale) => scale.value === value)?.label || ""
    }

    const handleImportanceChange = (attribute: string, importance: string) => {
        setSustainabilityImportance((prev) => ({
            ...prev,
            [attribute]: importance,
        }))
    }

    const [openAccordion, setOpenAccordion] = useState({ sustainability: false, category: true })

    const toggleAccordion = (key: "sustainability" | "category") => {
        setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }))
    }



    // Filters Sidebar
    return (
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
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="4"
                                                    step="1"
                                                    value={sustainabilityImportance[key]}
                                                    onChange={(e) => handleImportanceChange(key, e.target.value)}
                                                    className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                                    aria-label={`${filter.label} importance`}
                                                />
                                                <span className="text-sm text-green-700 w-28 text-right">
                                    {getImportanceLabel(sustainabilityImportance[key])}
                                  </span>
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
                                            className="peer h-4 w-4 shrink-0 rounded-sm border border-green-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 checked:bg-green-600 checked:text-white"
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
    )
}