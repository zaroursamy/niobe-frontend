import { BACKEND_URL } from "@/lib/config";

type FetchInput = RequestInfo | URL;

const API_BASE_URL = BACKEND_URL;

const defaultCredentials: RequestCredentials = "include";

let authRequest: Promise<AuthUser> | null = null;

async function buildRequestInit(init: RequestInit = {}) {
  console.debug("request init", init);
  const headers = new Headers(init.headers ?? {});

  if (import.meta.env.SSR && !headers.has("cookie")) {
    console.log("We are in SSR without cookie in headers.", headers);
    const cookieHeader = await getSsrCookieHeader();
    if (cookieHeader) headers.set("cookie", cookieHeader);
  }

  const credentials = init.credentials ?? defaultCredentials;

  return {
    ...init,
    headers,
    credentials: credentials,
  } satisfies RequestInit;
}

async function getSsrCookieHeader() {
  console.debug("Getting ssr cookie header ...");
  try {
    const { getRequest } = await import("@tanstack/react-start/server");

    const cookie = getRequest().headers.get("cookie") ?? undefined;

    console.log("cookie from getRequest", cookie);
    return cookie;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export type AuthUser = {
  email: string;
};

export function clearAuthCache() {
  authRequest = null;
}

export async function checkAuth(
  options: { useCache?: boolean } = {},
): Promise<AuthUser> {
  const useCache = options.useCache ?? true;

  if (useCache && authRequest) {
    return authRequest;
  }

  authRequest = (async () => {
    const response = await fetchWithRefresh(`${API_BASE_URL}/auth/me`);

    console.log("Response from fetchWithRefresh", response);
    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return response.json() as Promise<AuthUser>;
  })();

  try {
    return await authRequest;
  } catch (error) {
    clearAuthCache();
    throw error;
  }
}

// src/lib/auth.ts
export async function refreshSession(): Promise<void> {
  console.log("🔄 Starting refresh...");
  console.log("📍 URL:", `${API_BASE_URL}/auth/refresh`);
  console.log("🍪 Current cookies:", await getSsrCookieHeader());

  const requestInit = await buildRequestInit({ method: "POST" });
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, requestInit);

  console.log("📥 Refresh response status:", response.status);
  console.log("📥 Refresh response ok:", response.ok);

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Refresh failed body:", text);
    throw new Error(`Refresh failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  console.log("✅ Refresh successful, data:", data);
}

export async function fetchWithRefresh(
  input: FetchInput,
  init: RequestInit = {},
) {
  const requestInit = await buildRequestInit(init);

  const firstResponse = await fetch(input, requestInit);

  // Si ce n'est pas 401, retourne directement
  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  // Tentative de refresh
  try {
    await refreshSession();
  } catch (error) {
    // Si le refresh échoue, throw l'erreur au lieu de retourner la 401
    console.error("Refresh session failed:", error);
    throw new Error("Session refresh failed");
  }

  // Retry la requête originale après le refresh réussi
  return fetch(input, requestInit);
}

export { API_BASE_URL };
export { BACKEND_URL };
