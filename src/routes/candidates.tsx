import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

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

const candidatesQueryOptions = () =>
  queryOptions({
    queryKey: ["candidates"],
    queryFn: async (): Promise<Candidate[]> => {
      const response = await fetchWithRefresh(`${BACKEND_URL}/candidates`);

      console.log("Fetched candidates", response);

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      return response.json();
    },
  });

export const Route = createFileRoute("/candidates")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies CandidatesContext;
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(candidatesQueryOptions()),
  component: CandidatesPage,
});

function CandidatesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, refetch } = useSuspenseQuery(candidatesQueryOptions());

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

        <CandidateList candidates={data} />
      </section>
    </main>
  );
}
