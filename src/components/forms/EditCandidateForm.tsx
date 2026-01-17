import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Candidate } from "@/components/candidates/CandidateList";
import { updateCandidate } from "@/data/candidates";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string(),
  title: z.string(),
  experience: z.string(),
  notes: z.string(),
  source: z.enum(["linkedin", "email", "cooptation", "other"]),
});

export type EditCandidateFormValues = z.infer<typeof formSchema>;

type EditCandidateFormProps = {
  candidate: Candidate;
  onSuccess?: (updated?: unknown) => void;
  onCancel?: () => void;
};

export default function EditCandidateForm({
  candidate,
  onSuccess,
  onCancel,
}: EditCandidateFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: candidate.first_name,
      lastName: candidate.last_name,
      email: candidate.email ?? "",
      phone: candidate.phone ?? "",
      title: candidate.title ?? "",
      experience:
        candidate.experience_years != null
          ? String(candidate.experience_years)
          : "",
      notes: candidate.notes ?? "",
      source: candidate.source ?? "other",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        const payload = {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phone: value.phone,
          title: value.title,
          experience: value.experience ? Number(value.experience) : undefined,
          notes: value.notes,
          source: value.source,
        };

        const updated = await updateCandidate(candidate.id, payload);
        onSuccess?.(updated);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update candidate";
        setError(message);
      }
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="firstName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>First name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Jane"
                  autoComplete="given-name"
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        <form.Field
          name="lastName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Last name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="jane@company.com"
                  autoComplete="email"
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        <form.Field
          name="phone"
          children={(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Phone</Label>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                autoComplete="tel"
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="title"
          children={(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Senior Product Manager"
              />
            </div>
          )}
        />

        <form.Field
          name="experience"
          children={(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Experience (years)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="5"
              />
            </div>
          )}
        />
      </div>

      <form.Field
        name="notes"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Notes</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Key details to remember about this candidate..."
              rows={4}
            />
          </div>
        )}
      />

      <form.Field
        name="source"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Source</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) =>
                field.handleChange(value as EditCandidateFormValues["source"])
              }
            >
              <SelectTrigger className="w-full" id={field.name}>
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
        )}
      />

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
