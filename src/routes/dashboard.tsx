import { createFileRoute, Link } from "@tanstack/react-router";

type MeResponse = {
  email?: string;
};

export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const response = await fetch("http://localhost:8000/auth/me", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = (await response.json()) as MeResponse;
    return { user: data };
  },
  component: DashboardPage,
  errorComponent: DashboardError,
});

function DashboardPage() {
  const { user } = Route.useLoaderData();
  const email = user.email ?? "teammate";

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

function DashboardError({ error }: { error: Error }) {
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
          {error.message || "Please sign in to continue."}
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
