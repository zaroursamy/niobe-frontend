import { useState } from "react";

import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useAuth } from "@/hooks/use-auth";
import { signIn } from "@/data/auth";

const formSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormStatus = {
  error?: string;
  success?: string;
};

export default function SignInForm() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<FormStatus>({});

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setStatus({});

      try {
        await signIn(value);
        setStatus({ success: "Signed in successfully" });
        formApi.reset();
        await refreshUser();
        await navigate({ to: "/dashboard" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setStatus({ error: message });
      }
    },
  });

  return (
    <form
      className="space-y-6 "
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

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
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password *</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="At least 8 characters"
                    autoComplete="current-password"
                  />
                </InputGroup>
                <FieldDescription>
                  Use a strong password to keep your account safe.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      {status.error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {status.error}
        </p>
      )}
      {status.success && (
        <p className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          {status.success}
        </p>
      )}

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldDescription className="text-xs text-muted-foreground">
          * required.
        </FieldDescription>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStatus({});
              form.reset();
            }}
          >
            Reset
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Sign in"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </Field>

      <p className="text-center text-xs text-muted-foreground">
        You don&apos;t have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-semibold text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
