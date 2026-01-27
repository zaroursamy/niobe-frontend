import { fetchWithRefresh } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";

export type LoginResponse = {
  access_token?: string;
  token_type?: string;
  message?: string;
};

export type RegisterResponse = {
  message?: string;
};

export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(data?.message ?? "Unable to sign in");
  }

  return data;
}

export async function signUp(payload: {
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as RegisterResponse;

  if (!response.ok) {
    throw new Error(data?.message ?? "Unable to create account");
  }

  return data;
}

export async function logout(): Promise<void> {
  await fetchWithRefresh(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
  });
}
