import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCandidateCv } from "@/data/candidates";

type AttachCVFormProps = {
  candidateId: string;
  onSuccess?: (payload?: unknown) => void;
  onCancel?: () => void;
};

export default function AttachCVForm({
  candidateId,
  onSuccess,
  onCancel,
}: AttachCVFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = await uploadCandidateCv(candidateId, file);
      setFile(null);
      onSuccess?.(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="cv-file">PDF file</Label>
        <Input
          id="cv-file"
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
          }}
        />
        {file ? (
          <p className="text-xs text-muted-foreground">{file.name}</p>
        ) : null}
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload CV"}
        </Button>
      </div>
    </form>
  );
}
