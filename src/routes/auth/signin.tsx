import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/forms/SignInForm";

export const Route = createFileRoute("/auth/signin")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-accent/10 to-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <section className="bg-card/20 border border-border rounded-2xl shadow-2xl shadow-black/30 p-8 backdrop-blur-sm">
          <div className="space-y-2 text-center mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Welcome back</p>
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-muted-foreground text-sm">
              Access your dashboard and continue hiring with confidence.
            </p>
          </div>
          <SignInForm />
        </section>
      </div>
    </main>
  );
}
