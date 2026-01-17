import { useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import CVButton from "@/components/buttons/CVButton";
import EditCandidateButton from "@/components/buttons/EditCandidateButton";
import CandidateProfile from "@/components/candidates/CandidateProfile";
import type { Candidate } from "@/components/candidates/CandidateList";
import AttachCVForm from "@/components/forms/AttachCVForm";
import EditCandidateForm from "@/components/forms/EditCandidateForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const candidateQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["candidate", id],
    queryFn: () => fetchCandidate(id),
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
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const { data, refetch } = useSuspenseQuery(candidateQueryOptions(id));

  useEffect(() => {
    if (!isCvOpen) {
      setCvUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setCvError(null);
      setIsCvLoading(false);
      return;
    }

    let isActive = true;

    const fetchCv = async () => {
      setIsCvLoading(true);
      setCvError(null);
      try {
        const metaResponse = await fetchWithRefresh(
          `${BACKEND_URL}/candidates/${id}/cvs/first`,
        );
        if (!metaResponse.ok) {
          const message = await metaResponse.text();
          throw new Error(message || "Failed to load CV");
        }
        const meta = (await metaResponse.json()) as { cv_id?: string };
        if (!meta.cv_id) {
          throw new Error("No CV available");
        }

        const fileResponse = await fetchWithRefresh(
          `${BACKEND_URL}/candidates/${id}/cvs/${meta.cv_id}`,
        );
        if (!fileResponse.ok) {
          const message = await fileResponse.text();
          throw new Error(message || "Failed to load CV file");
        }

        const blob = await fileResponse.blob();
        if (!isActive) return;
        const url = URL.createObjectURL(blob);
        setCvUrl(url);
      } catch (err) {
        if (!isActive) return;
        const message =
          err instanceof Error ? err.message : "Failed to load CV";
        setCvError(message);
      } finally {
        if (isActive) setIsCvLoading(false);
      }
    };

    void fetchCv();

    return () => {
      isActive = false;
    };
  }, [id, isCvOpen]);

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CVButton
                  className="shadow-sm hover:brightness-110"
                  disabled={!data}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsCvOpen(true)}>
                  See CV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsAttachOpen(true)}>
                  Upload CV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <Dialog open={isAttachOpen} onOpenChange={setIsAttachOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach CV</DialogTitle>
            <DialogDescription>
              Upload a PDF resume for this candidate.
            </DialogDescription>
          </DialogHeader>
          <AttachCVForm
            candidateId={id}
            onCancel={() => setIsAttachOpen(false)}
            onSuccess={() => setIsAttachOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isCvOpen} onOpenChange={setIsCvOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Candidate CV</DialogTitle>
            <DialogDescription>
              Preview the latest uploaded CV.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-background p-4">
            {isCvLoading ? (
              <p className="text-sm text-muted-foreground">Loading CV...</p>
            ) : cvError ? (
              <p className="text-sm text-destructive">{cvError}</p>
            ) : cvUrl ? (
              <object
                data={cvUrl}
                type="application/pdf"
                className="h-[70vh] w-full"
              >
                <p className="text-sm text-muted-foreground">
                  Unable to display PDF.{" "}
                  <a
                    href={cvUrl}
                    className="text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </p>
              </object>
            ) : (
              <p className="text-sm text-muted-foreground">No CV available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
