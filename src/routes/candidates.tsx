import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import CreateCandidateButton from "@/components/buttons/CreateCandidateButton";
import CandidateList, {
  type Candidate,
} from "@/components/candidates/CandidateList";
import CreateCandidateForm from "@/components/forms/CandidateForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchWithRefresh, type AuthUser } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";
import { requireAuth } from "@/lib/middleware/auth";

type CandidatesContext = { user: AuthUser };

async function fetchCandidates(): Promise<Candidate[]> {
  const response = await fetchWithRefresh(`${BACKEND_URL}/candidates`);

  console.log("Fetched candidates", response);

  if (!response.ok) {
    throw new Error("Failed to fetch candidates");
  }

  return response.json();
}

export const Route = createFileRoute("/candidates")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies CandidatesContext;
  },
  component: CandidatesPage,
});

function CandidatesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-accent/10 to-background text-foreground px-6 py-16">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Pipeline
            </p>
            <h1 className="text-4xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">
              Data loaded from the backend candidates endpoint.
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <CreateCandidateButton className="shadow-sm hover:brightness-110" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create candidate</DialogTitle>
                <DialogDescription>
                  Add a candidate to your pipeline. This form is local only for
                  now.
                </DialogDescription>
              </DialogHeader>

              <CreateCandidateForm
                onSuccess={() => {
                  setIsCreateOpen(false);
                  void refetch();
                }}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <LoadingGrid />
        ) : isError ? (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Error loading candidates"
            }
            onRetry={() => refetch()}
          />
        ) : (
          <CandidateList candidates={data} />
        )}
      </section>
    </main>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-card/40 p-6 shadow-sm animate-pulse"
        >
          <div className="h-5 w-1/3 rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-1/2 rounded bg-foreground/10" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-2/3 rounded bg-foreground/10" />
            <div className="h-3 w-1/2 rounded bg-foreground/10" />
            <div className="h-3 w-3/5 rounded bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
      <p className="font-semibold">Failed to load candidates</p>
      <p className="text-sm mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm transition hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
