import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

import { API_BASE_URL, checkAuth, fetchWithRefresh } from "@/lib/auth";

type MeResponse = {
  email?: string | null;
};

type DashboardContext = {
  user: MeResponse;
};
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    console.log("🔍 beforeLoad called at:", new Date().toISOString());

    try {
      const user = await checkAuth();
      console.log("✅ User authenticated:", user.email);
      return { user } satisfies DashboardContext;
    } catch (error) {
      console.error("❌ Auth failed:", error);
      if (isRedirect(error)) throw error;

      throw redirect({
        to: "/auth/signin",
        search: { redirect: location.href },
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext() as DashboardContext;
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
