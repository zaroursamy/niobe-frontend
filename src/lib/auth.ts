type FetchInput = RequestInfo | URL;

const API_BASE_URL = "http://localhost:8000";

let refreshPromise: Promise<Response> | null = null;

const defaultCredentials: RequestCredentials = "include";

async function refreshSession() {
  console.log("Try refreshing session");
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: defaultCredentials,
    }).finally(() => {
      refreshPromise = null;
    });
  }

  const response = await refreshPromise;

  if (!response.ok) {
    throw new Error("Unable to refresh session");
  }

  return response;
}

export async function fetchWithRefresh(
  input: FetchInput,
  init: RequestInit = {},
) {
  const requestInit = {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  } satisfies RequestInit;

  const firstResponse = await fetch(input, requestInit);

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  try {
    const refreshResponse = await refreshSession();

    if (!refreshResponse.ok) {
      console.error("Refresh response is not ok", refreshResponse);
      throw new Error("Refresh failed");
    }
  } catch (_error) {
    return firstResponse;
  }

  return fetch(input, requestInit);
}

export { API_BASE_URL };
