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

type CandidateCvParsedDialogProps = {
  candidateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CandidateCvParsedResponse = {
  filename: string;
  text?: string | null;
  ocr_used: boolean;
};

export default function CandidateCvParsedDialog({
  candidateId,
  open,
  onOpenChange,
}: CandidateCvParsedDialogProps) {
  const [parsedData, setParsedData] =
    useState<CandidateCvParsedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setParsedData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const fetchParsed = async () => {
      setIsLoading(true);
      setError(null);
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

        const parsedResponse = await fetchWithRefresh(
          `${BACKEND_URL}/candidates/${candidateId}/cvs/${meta.cv_id}/parsed`,
        );
        if (!parsedResponse.ok) {
          const message = await parsedResponse.text();
          throw new Error(message || 'Failed to load parsed CV');
        }

        const payload =
          (await parsedResponse.json()) as CandidateCvParsedResponse;
        if (!isActive) return;
        setParsedData(payload);
      } catch (err) {
        if (!isActive) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load parsed CV';
        setError(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void fetchParsed();

    return () => {
      isActive = false;
    };
  }, [candidateId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Parsed CV
            {parsedData?.ocr_used ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                OCR used
              </span>
            ) : null}
          </DialogTitle>
          <DialogDescription>
            Raw text extracted from the latest CV.
          </DialogDescription>
          {parsedData?.filename ? (
            <p className="text-xs text-muted-foreground">
              File: {parsedData.filename}
            </p>
          ) : null}
        </DialogHeader>
        <div className="rounded-lg border border-border bg-background p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading parsed CV...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : parsedData?.text ? (
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm text-foreground">
              {parsedData.text}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              No parsed text available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
