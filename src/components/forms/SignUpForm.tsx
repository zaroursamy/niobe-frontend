import { FormEvent, useState } from "react";

import { Link } from "@tanstack/react-router";

type SubmissionState = "idle" | "loading" | "success" | "error";

type RegisterResponse = {
  message?: string;
};

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to create account");
      }

      setStatus("success");
      setFeedback(data?.message ?? "Account created");
      setEmail("");
      setPassword("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setStatus("error");
      setFeedback(message);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-semibold">Email *</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-semibold">Password *</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
      </label>

      {feedback && (
        <div
          role="status"
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            background:
              status === "error"
                ? "color-mix(in oklch, var(--destructive) 18%, var(--background))"
                : "color-mix(in oklch, var(--primary) 14%, var(--background))",
            borderColor:
              status === "error"
                ? "color-mix(in oklch, var(--destructive) 35%, var(--border))"
                : "color-mix(in oklch, var(--primary) 35%, var(--border))",
            color:
              status === "error"
                ? "var(--destructive-foreground)"
                : "var(--foreground)",
          }}
        >
          {feedback}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed font-semibold px-5 py-2 transition-all hover:brightness-95"
        >
          {status === "loading" ? "Creating..." : "Sign up"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
