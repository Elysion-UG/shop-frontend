// src/lib/api.ts
function apiUrl(p: string) {
  return `/api${p.startsWith("/") ? p : `/${p}`}`;
}

async function postJson(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function loginJwt(data: { email: string; password: string }) {
  // 1. Versuch: { email, password }
  let res = await postJson(apiUrl("/users/login"), {
    email: data.email,
    password: data.password,
  });

  // 2. Versuch (häufige API-Variante): { username, password }
  if (res.status === 401 || res.status === 400 || res.status === 415) {
    res = await postJson(apiUrl("/users/login"), {
      username: data.email,
      password: data.password,
    });
  }

  const rawText = await res.text().catch(() => "");
  let json: any = {};
  try { json = rawText ? JSON.parse(rawText) : {}; } catch {}

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.error ||
      rawText ||
      `Login fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }

  // Token-Felder flexibel akzeptieren (+ evtl. Authorization-Header)
  const authHeader = res.headers.get("authorization") || res.headers.get("Authorization");
  const tokenFromHeader = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const accessToken =
    json?.accessToken ??
    json?.token ??
    json?.jwt ??
    json?.access_token ??
    tokenFromHeader ??
    null;

  if (!accessToken) {
    throw new Error("Unerwartete Serverantwort (kein Token).");
  }

  return { accessToken, user: json?.user };
}