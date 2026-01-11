import { useState } from "react";

import { Link } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";

type SubmissionState = "idle" | "loading" | "success" | "error";

type RegisterResponse = {
  message?: string;
};

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      <label className="block space-y-2">
        <span className="text-sm font-medium">Email</span>
        <div className="relative">
          <Mail className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full bg-input border border-border rounded-lg py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring transition"
          />
        </div>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Password</span>
        <div className="relative">
          <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full bg-input border border-border rounded-lg py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring transition"
          />
        </div>
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3 transition-all hover:brightness-95"
      >
        {status === "loading" ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
