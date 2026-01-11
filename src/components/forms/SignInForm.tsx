import { FormEvent, useState } from "react";

import { Link, useNavigate } from "@tanstack/react-router";

type SubmissionState = "idle" | "loading" | "success" | "error";

type LoginResponse = {
  access_token?: string;
  token_type?: string;
};

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error("Unable to sign in");
      }

      setStatus("success");
      setFeedback(
        data?.access_token
          ? `Signed in. Token type: ${data.token_type ?? "bearer"}`
          : "Signed in successfully",
      );
      setEmail("");
      setPassword("");
      await navigate({ to: "/dashboard" });
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
          autoComplete="current-password"
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
          {status === "loading" ? "Sending..." : "Sign in"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You don't have an account ?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
