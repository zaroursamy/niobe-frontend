import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/config";

export type CandidateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  experience: string;
  notes: string;
  source: "linkedin" | "email" | "cooptation" | "other";
};

type CandidateFormProps = {
  onSuccess?: (created?: unknown) => void;
  onCancel?: () => void;
};

const initialValues: CandidateFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  title: "",
  experience: "",
  notes: "",
  source: "linkedin",
};

export default function CandidateForm({
  onSuccess,
  onCancel,
}: CandidateFormProps) {
  const [values, setValues] = useState<CandidateFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        title: values.title,
        experience: values.experience ? Number(values.experience) : undefined,
        notes: values.notes,
        source: values.source,
      };

      const response = await fetch(`${BACKEND_URL}/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to create candidate");
      }

      const created = await response.json().catch(() => undefined);
      setValues(initialValues);
      onSuccess?.(created);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create candidate";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof CandidateFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={values.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Jane"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={values.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="jane@company.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+33 6 12 34 56 78"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Senior Product Manager"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={values.experience}
            onChange={(e) => updateField("experience", e.target.value)}
            placeholder="5"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={values.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Key details to remember about this candidate..."
          rows={4}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="source">Source</Label>
        <Select
          value={values.source}
          onValueChange={(value) =>
            updateField("source", value as CandidateFormValues["source"])
          }
        >
          <SelectTrigger className="w-full" id="source">
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="cooptation">Cooptation</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create candidate"}
        </Button>
      </div>
    </form>
  );
}
