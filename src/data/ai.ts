import { fetchWithRefresh } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";

import type { CandidateCvParsedResponse } from "@/data/candidates";

export async function extractCandidateCvInfo(
  file: File,
): Promise<CandidateCvParsedResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithRefresh(`${BACKEND_URL}/ai/cv/extract-info`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || "Failed to extract CV info";
    try {
      const payload = JSON.parse(text) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // Ignore parse errors and use raw text.
    }
    throw new Error(message);
  }

  return response.json();
}
