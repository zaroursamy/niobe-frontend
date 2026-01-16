import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import CandidateProfile from "@/components/candidates/CandidateProfile";
import type { Candidate } from "@/components/candidates/CandidateList";
import { fetchWithRefresh, type AuthUser } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";
import { requireAuth } from "@/lib/middleware/auth";

type CandidateDetailContext = { user: AuthUser };

async function fetchCandidate(id: string): Promise<Candidate> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch candidate");
  }

  return response.json();
}

export const Route = createFileRoute("/candidate/$id")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies CandidateDetailContext;
  },
  component: CandidateDetailPage,
});

function CandidateDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => fetchCandidate(id),
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-accent/10 to-background text-foreground px-6 py-16">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Candidate
            </p>
            <h1 className="text-4xl font-bold">Profile</h1>
          </div>
          <Link
            to="/candidates"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary"
          >
            Back to candidates
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card/40 p-8 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 rounded bg-foreground/10" />
            <div className="mt-2 h-4 w-1/4 rounded bg-foreground/10" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-xl bg-foreground/10" />
              <div className="h-24 rounded-xl bg-foreground/10" />
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
            <p className="font-semibold">Failed to load candidate</p>
            <p className="text-sm mt-1">
              {error instanceof Error
                ? error.message
                : "Error loading candidate"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm transition hover:brightness-110"
            >
              Try again
            </button>
          </div>
        ) : data ? (
          <CandidateProfile candidate={data} />
        ) : null}
      </section>
    </main>
  );
}
