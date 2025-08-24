// src/lib/api.ts

/** Hilfsfunktion, um API-URLs zu erzeugen (mit /api-Präfix) */
function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/api${p}`; 
}

/** JWT-Login: POST /api/users/login
 *  Erwartete Response z. B.: { accessToken, refreshToken?, user? }
 */
export async function loginJwt(data: { email: string; password: string }) {
  const res = await fetch(apiUrl("/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
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

/** Authenticated fetch */
export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = apiUrl(path); // hängt /api davor
  return fetch(url, { ...init, headers });
}