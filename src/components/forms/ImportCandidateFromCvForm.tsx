import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateCandidateForm, {
  type CreateCandidateFormValues,
} from "@/components/forms/CandidateForm";
import {
  uploadCandidateCv,
  attachCvParsed,
  type CandidateCvParsedResponse,
  type CandidateCvLlmProfile,
} from "@/data/candidates";
import { extractCandidateCvInfo } from "@/data/ai";

type ImportCandidateFromCvFormProps = {
  onSuccess?: (created?: unknown) => void;
  onCancel?: () => void;
  onBack?: () => void;
};

const getProfile = (
  llm: CandidateCvParsedResponse["llm"],
): CandidateCvLlmProfile | null => {
  if (!llm) return null;
  return llm.profile ?? null;
};

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const buildInitialValues = (
  parsedData: CandidateCvParsedResponse | null,
): Partial<CreateCandidateFormValues> => {
  const profile = getProfile(parsedData?.llm ?? null);
  if (!profile) return {};

  const fullName = typeof profile.fullName === "string" ? profile.fullName : "";
  const { firstName, lastName } = splitFullName(fullName);
  const email = typeof profile.email === "string" ? profile.email : "";
  const phone = typeof profile.phone === "string" ? profile.phone : "";
  const title = typeof profile.title === "string" ? profile.title : "";
  const summary =
    typeof profile.summary === "string" ? profile.summary.trim() : "";

  const values: Partial<CreateCandidateFormValues> = {
    source: "other",
  };

  if (firstName) values.firstName = firstName;
  if (lastName) values.lastName = lastName;
  if (email) values.email = email;
  if (phone) values.phone = phone;
  if (title) values.title = title;
  if (summary) values.notes = summary;

  return values;
};

export default function ImportCandidateFromCvForm({
  onSuccess,
  onCancel,
  onBack,
}: ImportCandidateFromCvFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] =
    useState<CandidateCvParsedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const initialValues = useMemo(
    () => buildInitialValues(parsedData),
    [parsedData],
  );

  const handleImport = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = await extractCandidateCvInfo(file);
      setParsedData(payload);
      setFormKey((prev) => prev + 1);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to extract CV info";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!parsedData) {
    return (
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleImport();
        }}
      >
        {onBack ? (
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="import-cv-file">PDF file</Label>
          <Input
            id="import-cv-file"
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
            {isSubmitting ? "Extracting..." : "Extract from CV"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {onBack ? (
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setParsedData(null);
            setFile(null);
            setError(null);
          }}
        >
          Import another PDF
        </Button>
      </div>

      <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
        CV parsed. Review and adjust the fields before creating the candidate.
      </div>

      <CreateCandidateForm
        key={`import-${formKey}`}
        initialValues={initialValues}
        onSuccess={async (created?: unknown) => {
          const candidate = created as { id?: string } | undefined;
          if (candidate?.id && parsedData) {
            try {
              const cv = (await uploadCandidateCv(candidate.id, file!)) as {
                id: string;
              };
              await attachCvParsed(candidate.id, cv.id, parsedData);
            } catch {
              // CV attachment is best-effort; candidate was already created
            }
          }
          onSuccess?.(created);
        }}
        onCancel={onCancel}
      />
    </div>
  );
}
