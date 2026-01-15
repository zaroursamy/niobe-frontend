const env = import.meta.env as Record<string, string | undefined>;

// Prefer explicit env for the backend but fall back to localhost for local dev.
export const BACKEND_URL =
  env.VITE_BACKEND_URL ?? env.BACKEND_URL ?? "http://localhost:8000";
