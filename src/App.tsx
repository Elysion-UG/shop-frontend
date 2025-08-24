// src/lib/api.ts

/** Build a relative API URL so dev (Vite proxy) and prod (Nginx) work the same */
function apiUrl(p: string) {
  return `/api${p.startsWith('/') ? p : `/${p}`}`;
}

async function postJson(url: string, body: unknown) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Login: POST /users/login (via /api proxy) */
export async function loginJwt(data: { email: string; password: string }) {
  // 1st try with { email, password }
  let res = await postJson(apiUrl('/users/login'), {
    email: data.email,
    password: data.password,
  });

  // common variant: { username, password }
  if (res.status === 401 || res.status === 400 || res.status === 415) {
    res = await postJson(apiUrl('/users/login'), {
      username: data.email,
      password: data.password,
    });
  }

  const rawText = await res.text().catch(() => '');
  let json: any = {};
  try { json = rawText ? JSON.parse(rawText) : {}; } catch {}

  if (!res.ok) {
    const msg = json?.message || json?.error || rawText || `Login fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }

  // Token from body or Authorization header
  const authHeader = res.headers.get('authorization') || res.headers.get('Authorization');
  const tokenFromHeader = authHeader?.toLowerCase().startsWith('bearer ')
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
    throw new Error('Unerwartete Serverantwort (kein Token).');
  }

  return { accessToken, user: json?.user };
}

/** User details: GET /users/me (requires JWT in Authorization) */
export async function getMe<T = any>() {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(apiUrl('/users/me'), { headers });
  const txt = await res.text().catch(() => '');
  let json: any = {};
  try { json = txt ? JSON.parse(txt) : {}; } catch {}

  if (!res.ok) {
    const msg = json?.message || json?.error || txt || `/users/me fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

/** Authenticated fetch (adds Authorization header if we have a token) */
export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers });
}

/** Optional: register user via POST /users/register */
export async function registerUser(data: {
  email: string; password: string; firstName: string; lastName: string;
}) {
  const res = await postJson(apiUrl('/users/register'), data);
  const txt = await res.text().catch(() => '');
  if (!res.ok) {
    let msg = txt;
    try { const j = JSON.parse(txt); msg = j.message || j.error || txt; } catch {}
    throw new Error(msg || `Registrierung fehlgeschlagen (${res.status})`);
  }
  return txt ? JSON.parse(txt) : {};
}