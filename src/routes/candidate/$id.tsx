import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import EditCandidateButton from "@/components/buttons/EditCandidateButton";
import CandidateCvActions from "@/components/candidates/CandidateCvActions";
import CandidateProfile from "@/components/candidates/CandidateProfile";
import EditCandidateForm from "@/components/forms/EditCandidateForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AuthUser } from "@/lib/auth";
import { requireAuth } from "@/lib/middleware/auth";
import { deleteCandidate, getCandidate } from "@/data/candidates";

type CandidateDetailContext = { user: AuthUser };

const candidateQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["candidate", id],
    queryFn: () => getCandidate(id),
  });

export const Route = createFileRoute("/candidate/$id")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies CandidateDetailContext;
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(candidateQueryOptions(params.id)),
  component: CandidateDetailPage,
});

function CandidateDetailPage() {
  const { id } = Route.useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate({ from: Route.fullPath });
  const { data, refetch } = useSuspenseQuery(candidateQueryOptions(id));

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCandidate(id);
      toast.success("Candidate deleted");
      await navigate({ to: "/candidates" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete candidate";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div className="flex items-center gap-3">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <EditCandidateButton
                  className="shadow-sm hover:brightness-110"
                  disabled={!data}
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Edit candidate</DialogTitle>
                  <DialogDescription>
                    Update the candidate details and save your changes.
                  </DialogDescription>
                </DialogHeader>
                {data ? (
                  <EditCandidateForm
                    candidate={data}
                    onCancel={() => setIsEditOpen(false)}
                    onSuccess={() => {
                      setIsEditOpen(false);
                      void refetch();
                    }}
                  />
                ) : null}
              </DialogContent>
            </Dialog>
            <CandidateCvActions candidateId={id} disabled={!data} />
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Link
              to="/candidates"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary"
            >
              Back to candidates
            </Link>
          </div>
        </div>

        <CandidateProfile candidate={data} />
      </section>
    </main>
  );
}
