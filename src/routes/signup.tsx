import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/components/forms/SignUpForm";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <main className="min-h-screen text-foreground flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <section className="bg-card border border-border rounded-2xl shadow-xl p-8 backdrop-blur">
          <SignUpForm />
        </section>
      </div>
    </main>
  );
}
