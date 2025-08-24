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

/** ---- AUTH ---- */

/** Login: POST /users/login (backend expects /users/login, no /api prefix) */
export async function loginJwt(data: { email: string; password: string }) {
  // try { email, password }
  let res = await postJson(apiUrl('/users/login'), {
    email: data.email,
    password: data.password,
  });

  // some backends use { username, password } instead
  if (res.status === 400 || res.status === 401 || res.status === 415) {
    res = await postJson(apiUrl('/users/login'), {
      username: data.email,
      password: data.password,
    });
  }

  const raw = await res.text().catch(() => '');
  let json: any = {};
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || raw || `Login fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }

  // Token can be in body or Authorization header
  const authHeader = res.headers.get('authorization') || res.headers.get('Authorization');
  const tokenFromHeader =
    authHeader && authHeader.toLowerCase().startsWith('bearer ')
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

/** Current user: GET /users/me (requires Authorization: Bearer <token>) */
export async function getMe<T = any>() {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(apiUrl('/users/me'), { headers });
  const raw = await res.text().catch(() => '');
  let json: any = {};
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || raw || `/users/me fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

/** ---- GENERIC AUTHED FETCH ---- */

export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers });
}

/** ---- REGISTRATION ---- */

/** Register: POST /users/register */
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const res = await postJson(apiUrl('/users/register'), data);
  const raw = await res.text().catch(() => '');
  if (!res.ok) {
    let msg = raw;
    try {
      const j = raw ? JSON.parse(raw) : {};
      msg = j?.message || j?.error || raw;
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Registrierung fehlgeschlagen (${res.status})`);
  }
  return raw ? JSON.parse(raw) : {};
}