import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import CandidateDeleteButton from "@/components/candidates/CandidateDeleteButton";
import CandidateCvActions from "@/components/candidates/CandidateCvActions";
import CandidateEditDialog from "@/components/candidates/CandidateEditDialog";
import CandidateProfile from "@/components/candidates/CandidateProfile";
import type { AuthUser } from "@/lib/auth";
import { requireAuth } from "@/lib/middleware/auth";
import { getCandidate } from "@/data/candidates";

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
  const { data, refetch } = useSuspenseQuery(candidateQueryOptions(id));

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
            {data ? (
              <CandidateEditDialog
                candidate={data}
                onUpdated={() => {
                  void refetch();
                }}
              />
            ) : null}
            <CandidateCvActions candidateId={id} disabled={!data} />
            <CandidateDeleteButton candidateId={id} disabled={!data} />
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
