import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fetchWithRefresh } from '@/lib/auth';
import { BACKEND_URL } from '@/lib/config';

type CandidateCvPreviewDialogProps = {
  candidateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CandidateCvPreviewDialog({
  candidateId,
  open,
  onOpenChange,
}: CandidateCvPreviewDialogProps) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);

  useEffect(() => {
    if (!open) {
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
          `${BACKEND_URL}/candidates/${candidateId}/cvs/first`,
        );
        if (!metaResponse.ok) {
          const message = await metaResponse.text();
          throw new Error(message || 'Failed to load CV');
        }
        const meta = (await metaResponse.json()) as { cv_id?: string };
        if (!meta.cv_id) {
          throw new Error('No CV available');
        }

        const fileResponse = await fetchWithRefresh(
          `${BACKEND_URL}/candidates/${candidateId}/cvs/${meta.cv_id}`,
        );
        if (!fileResponse.ok) {
          const message = await fileResponse.text();
          throw new Error(message || 'Failed to load CV file');
        }

        const blob = await fileResponse.blob();
        if (!isActive) return;
        const url = URL.createObjectURL(blob);
        setCvUrl(url);
      } catch (err) {
        if (!isActive) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load CV';
        setCvError(message);
      } finally {
        if (isActive) setIsCvLoading(false);
      }
    };

    void fetchCv();

    return () => {
      isActive = false;
    };
  }, [candidateId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                Unable to display PDF.{' '}
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
  );
}
