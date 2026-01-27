import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

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
import { createCandidate } from "@/data/candidates";

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

export type CreateCandidateFormValues = z.infer<typeof formSchema>;

type CreateCandidateFormProps = {
  onSuccess?: (created?: unknown) => void;
  onCancel?: () => void;
  initialValues?: Partial<CreateCandidateFormValues>;
};

export default function CreateCandidateForm({
  onSuccess,
  onCancel,
  initialValues,
}: CreateCandidateFormProps) {
  const [error, setError] = useState<string | null>(null);
  const defaultValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      experience: "",
      notes: "",
      source: "linkedin",
      ...initialValues,
    }),
    [initialValues],
  );

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setError(null);

      try {
        const created = await createCandidate({
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phone: value.phone,
          title: value.title,
          experience: value.experience ? Number(value.experience) : undefined,
          notes: value.notes,
          source: value.source,
        });
        formApi.reset();
        onSuccess?.(created);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create candidate";
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
                field.handleChange(value as CreateCandidateFormValues["source"])
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
              {isSubmitting ? "Creating..." : "Create candidate"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
