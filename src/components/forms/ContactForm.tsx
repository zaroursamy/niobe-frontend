import type { CSSProperties } from 'react';

import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must be at most 50 characters.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must be at most 50 characters.'),
  email: z.string().trim().email('Enter a valid email.'),
  company: z
    .string()
    .trim()
    .max(80, 'Company name must be at most 80 characters.')
    .optional()
    .or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  onSubmit?: (values: ContactFormValues) => void | Promise<void>;
};

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
    },
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit?.(value);

        toast('We received your request', {
          description: (
            <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
              <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
          ),
          position: 'bottom-right',
          classNames: {
            content: 'flex flex-col gap-2',
          },
          style: {
            '--border-radius': 'calc(var(--radius) + 4px)',
          } as CSSProperties,
        });

        formApi.reset();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Please try again in a few seconds.';
        toast.error('Unable to send your request', {
          description: message,
          position: 'bottom-right',
        });
      }
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field
            name="firstName"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>First name *</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="given-name"
                    placeholder="Alex"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="lastName"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Last name *</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="family-name"
                    placeholder="Johnson"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <form.Field
          name="email"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="company"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.value !== '' && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Company name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Acme Corp"
                />
                <FieldDescription>Optional, but it helps us tailor the demo.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldDescription className="text-xs text-muted-foreground">
          The fields marked * are required.
        </FieldDescription>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </Field>
    </form>
  );
}
