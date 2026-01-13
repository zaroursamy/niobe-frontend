type FetchInput = RequestInfo | URL;

const API_BASE_URL = "http://localhost:8000";

const defaultCredentials: RequestCredentials = "include";

// src/lib/auth.ts
let isCheckingAuth = false;
let authPromise: any = null;
let refreshPromise: any = null;
export async function checkAuth() {
  // Évite les appels simultanés
  if (isCheckingAuth && authPromise) {
    return authPromise;
  }

  isCheckingAuth = true;
  authPromise = fetchWithRefresh(`${API_BASE_URL}/auth/me`)
    .then(async (response) => {
      console.log("Response from fetchWithRefresh", response);
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
      return response.json();
    })
    .finally(() => {
      isCheckingAuth = false;
      authPromise = null;
    });

  return authPromise;
}

// src/lib/auth.ts
export async function refreshSession(): Promise<void> {
  if (refreshPromise) {
    console.log("⏳ Refresh already in progress, waiting...");
    return refreshPromise;
  }

  console.log("🔄 Starting refresh...");
  console.log("📍 URL:", `${API_BASE_URL}/auth/refresh`);
  console.log("🍪 Current cookies:", document.cookie);

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (response) => {
      console.log("📥 Refresh response status:", response.status);
      console.log("📥 Refresh response ok:", response.ok);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Refresh failed body:", text);
        throw new Error(`Refresh failed: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log("✅ Refresh successful, data:", data);
    })
    .catch((error) => {
      console.error("💥 Refresh error:", error);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function fetchWithRefresh(
  input: FetchInput,
  init: RequestInit = {},
) {
  const requestInit = {
    ...init,
    credentials: init.credentials ?? defaultCredentials,
  } satisfies RequestInit;

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
