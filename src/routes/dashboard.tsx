import { createFileRoute } from "@tanstack/react-router";

import { requireAuth } from "@/lib/middleware/auth";
import type { AuthUser } from "@/lib/auth";

type DashboardContext = { user: AuthUser };

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies DashboardContext;
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext() as DashboardContext;
  const email = user.email;

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
