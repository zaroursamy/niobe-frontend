import { fetchWithRefresh } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";
import { z } from "zod";

import type { Candidate } from "@/components/candidates/CandidateList";

export const candidatesSearchSchema = z.object({
  q: z.string().optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  experience_years: z.preprocess((value) => {
    if (value === "" || value == null) return undefined;
    return Number(value);
  }, z.number().int().nonnegative().optional()),
  notes: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CandidatesSearch = z.infer<typeof candidatesSearchSchema>;

export type CandidateCvLlmProfile = {
  fullName?: string;
  summary?: string;
  email?: string;
  title?: string;
  phone?: string;
};

export type CandidateCvLlmPayload = {
  profile?: CandidateCvLlmProfile;
};

export type CandidateCvParsedResponse = {
  filename: string;
  lang?: string | null;
  text?: string | null;
  llm?: CandidateCvLlmPayload | null;
  ocr_used: boolean;
};

export type CreateCandidatePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  experience?: number;
  notes: string;
  source: string;
};

export async function createCandidate(
  payload: CreateCandidatePayload,
): Promise<unknown> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create candidate");
  }

  return response.json().catch(() => undefined);
}

export async function getCandidate(id: string): Promise<Candidate> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch candidate");
  }

  return response.json();
}

export async function getCandidates(
  query: CandidatesSearch = {},
): Promise<Candidate[]> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const queryString = params.toString();
  const response = await fetchWithRefresh(
    `${BACKEND_URL}/candidates${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch candidates");
  }

  return response.json();
}

export async function deleteCandidate(id: string): Promise<void> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete candidate");
  }
}

export async function updateCandidate(
  id: string,
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
    experience?: number;
    notes: string;
    source: string;
  },
): Promise<unknown> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update candidate");
  }

  return response.json().catch(() => undefined);
}

export async function uploadCandidateCv(
  candidateId: string,
  file: File,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithRefresh(
    `${BACKEND_URL}/candidates/${candidateId}/cvs`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to upload CV");
  }

  return response.json().catch(() => undefined);
}

export async function attachCvParsed(
  candidateId: string,
  cvId: string,
  parsed: CandidateCvParsedResponse,
): Promise<void> {
  const response = await fetchWithRefresh(
    `${BACKEND_URL}/candidates/${candidateId}/cvs/${cvId}/parsed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to attach parsed CV");
  }
}
