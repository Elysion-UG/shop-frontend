// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginJwt } from "../lib/api"; // nutzt VITE_API_URL + POST /api/auth/login

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowError(null);
    setIsSubmitting(true);

    try {
      if (!email || !password) throw new Error("Bitte E-Mail und Passwort eingeben");

      // ---- JWT-Login gegen dein Backend ----
      // Erwartete Response: { accessToken: string, ... }
      const res = await loginJwt({ email, password });

      // Token speichern (einfacher Start; für Produktion ggf. httpOnly-Cookies auf Serverseite nutzen)
      localStorage.setItem("accessToken", res.accessToken);

      // Erfolg → weiter zum Shop (oder wohin du willst)
      navigate("/shop", { replace: true });
    } catch (err: any) {
      setShowError(err?.message ?? "Login fehlgeschlagen");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto w-full max-w-md rounded-xl border bg-white text-gray-900 shadow border-green-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h1 className="text-2xl font-semibold leading-none tracking-tight text-green-800">Anmelden</h1>
            <p className="text-green-600">Willkommen zurück! Bitte melde dich an.</p>
          </div>

          <div className="p-6 pt-0">
            {showError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {showError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-green-800">
                  E-Mail-Adresse
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                    placeholder="du@beispiel.de"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-green-800">
                  Passwort
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Wird angemeldet…"
                ) : (
                  <span className="inline-flex items-center">
                    Einloggen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            {/* Optionaler Divider / Social Login Platzhalter */}
            {/* <div className="my-6 flex items-center gap-4 text-xs text-green-700">
              <div className="h-px flex-1 bg-green-200" />
              oder
              <div className="h-px flex-1 bg-green-200" />
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-green-300 bg-white px-4 text-sm font-medium text-green-800 shadow-sm transition-colors hover:bg-green-50"
            >
              Mit Provider anmelden
            </button> */}

            <div className="mt-6 text-center text-sm text-green-700">
              Neu hier?{" "}
              <Link to="/onboarding" className="font-medium text-green-800 underline">
                Konto erstellen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}