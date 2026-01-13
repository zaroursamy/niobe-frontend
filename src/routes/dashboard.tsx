import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { API_BASE_URL, fetchWithRefresh } from "@/lib/auth";

type MeResponse = {
  email?: string | null;
};

type DashboardState =
  | { status: "loading" }
  | { status: "authorized"; user: MeResponse }
  | { status: "unauthorized"; message: string };

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      try {
        const response = await fetchWithRefresh(`${API_BASE_URL}/auth/me`);

        if (!isCurrent) return;

        if (!response.ok) {
          setState({
            status: "unauthorized",
            message: "Please sign in to continue.",
          });
          return;
        }

        const data = (await response.json()) as MeResponse;
        setState({ status: "authorized", user: data });
      } catch (error) {
        if (!isCurrent) return;
        const message =
          error instanceof Error ? error.message : "Please sign in to continue.";
        setState({ status: "unauthorized", message });
      }
    };

    void load();

    return () => {
      isCurrent = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <main className="min-h-screen text-foreground flex items-center justify-center px-6 py-16">
        <section className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-xl p-10 text-center space-y-4">
          <h1 className="text-3xl font-semibold">Loading dashboard...</h1>
          <p className="text-muted-foreground">Fetching your account info.</p>
        </section>
      </main>
    );
  }

  if (state.status === "unauthorized") {
    return (
      <main
        className="min-h-screen text-foreground flex items-center justify-center px-6 py-16"
        style={{
          background:
            "radial-gradient(circle at 15% 25%, color-mix(in oklch, var(--primary) 20%, var(--background)), color-mix(in oklch, var(--accent) 12%, var(--background)) 40%, var(--background))",
        }}
      >
        <section className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-xl p-10 text-center space-y-4">
          <h1 className="text-3xl font-semibold">Access denied</h1>
          <p className="text-muted-foreground">
            {state.message || "Please sign in to continue."}
          </p>
          <Link
            to="/auth/signin"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all text-primary-foreground bg-primary hover:brightness-95"
          >
            Go to sign in
          </Link>
        </section>
      </main>
    );
  }

  const email = state.user.email ?? "teammate";

  return (
    <main className="min-h-screen text-foreground flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-xl p-10 text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome, {email}!</h1>
        <p className="text-muted-foreground text-lg">
          What do you want to do ?
        </p>
      </section>
    </main>
  );
}
