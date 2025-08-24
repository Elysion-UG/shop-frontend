// src/pages/OnboardingPage.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Heart,
  Recycle,
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { registerUser } from "../lib/api";

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
} as const;

const importanceScale = [
  { value: "1", label: "Not Important", color: "text-gray-500" },
  { value: "2", label: "Somewhat Important", color: "text-yellow-600" },
  { value: "3", label: "Important", color: "text-orange-600" },
  { value: "4", label: "Very Important", color: "text-green-600" },
];

type SustainabilityImportance = Record<string, string>;

export default function Onboarding() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    newsletter: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [sustainabilityImportance, setSustainabilityImportance] =
    useState<SustainabilityImportance>(
      Object.keys(sustainabilityFilters).reduce(
        (acc, key) => ({ ...acc, [key]: "1" }),
        {} as Record<string, string>
      )
    );

  const handleAccountDataChange = (field: string, value: string | boolean) => {
    setAccountData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImportanceChange = (attribute: string, importance: string) => {
    setSustainabilityImportance((prev) => ({ ...prev, [attribute]: importance }));
  };

  const isStep1Valid = () => {
    return (
      accountData.firstName.trim() &&
      accountData.lastName.trim() &&
      /\S+@\S+\.\S+/.test(accountData.email) &&
      accountData.password.length >= 8 &&
      accountData.password === accountData.confirmPassword &&
      accountData.agreeToTerms
    );
  };

  const getProgressPercentage = () => (currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100);

  const calculatePreferenceSummary = () => {
    const entries = Object.entries(sustainabilityImportance)
      .filter(([, v]) => parseInt(v, 10) >= 3)
      .sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10))
      .slice(0, 3);

    return entries.map(
      ([key]) => (sustainabilityFilters as any)[key]?.label || key
    );
  };

  const handleCreateAccount = async () => {
    if (!isStep1Valid() || isSubmitting) return;
    setFormError(null);
    setIsSubmitting(true);

    try {
      // POST /users/register
      await registerUser({
        email: accountData.email.trim(),
        password: accountData.password,
        firstName: accountData.firstName.trim(),
        lastName: accountData.lastName.trim(),
      });

      // optional: User im LocalStorage vormerken (ohne Token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: accountData.firstName.trim(),
          lastName: accountData.lastName.trim(),
          email: accountData.email.trim(),
        })
      );
      // Header sofort updaten
      window.dispatchEvent(new Event("userChanged"));

      // Weiter zu Step 3 (Success)
      setCurrentStep(3);
    } catch (err: any) {
      setFormError(
        err?.message ||
          "Registrierung fehlgeschlagen. Bitte Eingaben prüfen und erneut versuchen."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartShopping = () => {
    navigate("/shop", { replace: true });
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">
                Step {currentStep} of 3
              </span>
              <span className="text-sm text-green-600">
                {getProgressPercentage()}% Complete
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full w-full flex-1 bg-green-600 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${100 - getProgressPercentage()}%)` }}
              />
            </div>
          </div>

          {/* Errors */}
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Step 1: Account */}
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
                    <label htmlFor="firstName" className="text-sm font-medium text-green-800">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={accountData.firstName}
                      onChange={(e) => handleAccountDataChange("firstName", e.target.value)}
                      className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm font-medium text-green-800">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      value={accountData.lastName}
                      onChange={(e) => handleAccountDataChange("lastName", e.target.value)}
                      className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-green-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                    <input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) => handleAccountDataChange("email", e.target.value)}
                      className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-green-800">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                    <input
                      id="password"
                      type="password"
                      value={accountData.password}
                      onChange={(e) => handleAccountDataChange("password", e.target.value)}
                      className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                      placeholder="Create a secure password (min. 8 chars)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-green-800">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) =>
                        handleAccountDataChange("confirmPassword", e.target.value)
                      }
                      className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
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
                      className="h-4 w-4 rounded-sm border border-green-300 checked:bg-green-600 checked:text-white"
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
                      className="h-4 w-4 rounded-sm border border-green-300 checked:bg-green-600 checked:text-white"
                    />
                    <span className="text-sm text-green-700">
                      Send me updates about new sustainable products and eco-friendly tips
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Valid() || isSubmitting}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  Continue to Preferences
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="rounded-xl border bg-white text-gray-900 shadow border-green-200">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-green-800">
                  <Sparkles className="w-6 h-6" />
                  Your Sustainability Preferences
                </h3>
                <p className="text-green-600">
                  Help us personalize your shopping experience by rating how important
                  each sustainability aspect is to you
                </p>
              </div>

              <div className="p-6 pt-0 space-y-8">
                {Object.entries(sustainabilityFilters).map(([key, filter]) => {
                  const Icon = filter.icon;
                  return (
                    <div
                      key={key}
                      className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-100"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-800 mb-1">{filter.label}</h3>
                          <p className="text-sm text-green-600 mb-2">{filter.description}</p>
                          <p className="text-xs text-green-500 italic">
                            Examples: {filter.examples}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-green-800 mb-3 block">
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
                                onChange={() =>
                                  handleImportanceChange(key, scale.value)
                                }
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
                  );
                })}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center justify-center h-10 px-4 py-2 flex-1 border border-green-300 text-green-700 hover:bg-green-50 rounded-md"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center h-11 px-8 flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Done */}
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
                  Your account has been created and your sustainability preferences
                  have been saved.
                </p>
              </div>

              <div className="p-6 pt-0 space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Your Top Sustainability Priorities:
                  </h3>
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
                    className="inline-flex items-center justify-center h-10 px-4 py-2 flex-1 border border-green-300 text-green-700 hover:bg-green-50 rounded-md"
                  >
                    Adjust Preferences
                  </button>
                  <button
                    onClick={handleStartShopping}
                    className="inline-flex items-center justify-center h-11 px-8 flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
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
  );
}