// src/pages/LoginPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginJwt } from "../lib/api"; // nutzt VITE_API_URL + POST /api/auth/login

type LoginResponse = {
  accessToken: string;
  // ggf. weitere Felder: refreshToken, user, roles, ...
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);

  // Wenn bereits eingeloggt → direkt weiter
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/shop", { replace: true });
  }, [navigate]);

  // einfache Client-Validierung
  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const isFormValid = isEmailValid && password.length >= 6;

  useEffect(() => {
    setFieldErrors((prev) => ({
      ...prev,
      email: email && !isEmailValid ? "Bitte eine gültige E-Mail eingeben" : undefined,
    }));
  }, [email, isEmailValid]);

  useEffect(() => {
    setFieldErrors((prev) => ({
      ...prev,
      password: password && password.length < 6 ? "Mindestens 6 Zeichen" : undefined,
    }));
  }, [password]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setFormError(null);
    setIsSubmitting(true);

    // Vorherige Requests abbrechen
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // ✅ signal als 2. Argument übergeben (passend zu deiner api.ts)
      const res = (await loginJwt(
        { email, password },
        { signal: controller.signal }
      )) as LoginResponse;

      if (!res?.accessToken) {
        throw new Error("Unerwartete Serverantwort (kein accessToken).");
      }

      // Token speichern (für Produktion: httpOnly Cookie serverseitig ist sicherer)
      localStorage.setItem("accessToken", res.accessToken);

      navigate("/shop", { replace: true });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // ignorieren (neuer Submit hat alten abgebrochen)
      } else if (isFetchError(err)) {
        setFormError(mapHttpErrorToMessage(err.status));
      } else if (err instanceof Error) {
        setFormError(err.message || "Login fehlgeschlagen");
      } else {
        setFormError("Login fehlgeschlagen");
      }
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
            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-green-800">
                  E-Mail-Adresse
                </label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-10 w-full rounded-md border bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30 ${
                      fieldErrors.email ? "border-red-300" : "border-green-300"
                    }`}
                    placeholder="du@beispiel.de"
                    autoComplete="email"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-green-800">
                  Passwort
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-10 w-full rounded-md border bg-white px-3 py-2 pl-10 pr-10 text-sm placeholder:text-gray-400 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/30 ${
                      fieldErrors.password ? "border-red-300" : "border-green-300"
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                    className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-green-50"
                  >
                    {showPw ? <EyeOff className="h-4 w-4 text-green-600" /> : <Eye className="h-4 w-4 text-green-600" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
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

/** ---- kleine Helfer ---- */

function isFetchError(err: unknown): err is { status?: number } {
  return typeof err === "object" && err !== null && "status" in err;
}

function mapHttpErrorToMessage(status?: number) {
  switch (status) {
    case 400:
    case 422:
      return "Eingaben prüfen – ungültige Anmeldedaten.";
    case 401:
      return "E-Mail oder Passwort falsch.";
    case 403:
      return "Zugriff verweigert.";
    case 500:
      return "Serverfehler. Bitte später erneut versuchen.";
    case 0:
      return "Keine Verbindung zum Server.";
    default:
      return "Login fehlgeschlagen.";
  }
}