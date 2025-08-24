// src/lib/api.ts

// Env-URL holen (kann undefined sein, wenn .env.local fehlt)
const RAW = (import.meta as any)?.env?.VITE_API_URL as string | undefined;

// Trailing Slashes entfernen + Fallback -> localhost:8080
const API_URL =
  (RAW && RAW.replace(/\/+$/, "")) ||
  "http://localhost:8080";

/** Hilfsfunktion zum sauberen Zusammenfügen von Base + Pfad */
function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

/** JWT-Login: erwartet z. B. { accessToken, ... } als Response */
export async function loginJwt(data: { email: string; password: string }) {
  const res = await fetch(joinUrl(API_URL, "/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Fehlermeldung aus dem Backend, wenn vorhanden
    let msg = "";
    try {
      msg = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Login fehlgeschlagen (${res.status})`);
  }

  return res.json() as Promise<{
    accessToken: string;
    refreshToken?: string;
    user?: any;
  }>;
}

/** Authenticated fetch (JWT im Authorization-Header mitschicken) */
export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(joinUrl(API_URL, path), { ...init, headers });
}