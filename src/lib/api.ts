// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

/** JWT-Login: erwartet z. B. { accessToken, ... } als Response */
export async function loginJwt(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Login fehlgeschlagen (${res.status})`);
  }
  return res.json() as Promise<{ accessToken: string; refreshToken?: string; user?: any }>;
}

/** Authenticated fetch (JWT im Authorization-Header mitschicken) */
export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers });
}