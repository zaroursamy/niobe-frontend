import { createFileRoute } from "@tanstack/react-router";
import { FormEvent } from "react";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen from-background via-accent/10 to-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto bg-card/20 border border-border rounded-2xl p-10 backdrop-blur-sm shadow-2xl shadow-black/30">
        <div className="space-y-3 text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">
            Contact
          </p>
          <h1 className="text-4xl font-bold">Book a demo</h1>
          <p className="text-muted-foreground">
            Tell us who you are and we will reach out with a tailored
            walkthrough.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-semibold">First name *</span>
              <input
                required
                name="firstName"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="Alex"
              />
            </label>
            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-semibold">Name *</span>
              <input
                required
                name="lastName"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="Johnson"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-left">
            <span className="text-sm font-semibold">Email *</span>
            <input
              required
              name="email"
              type="email"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="you@company.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-left">
            <span className="text-sm font-semibold">Company name</span>
            <input
              name="company"
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="Acme Corp"
            />
          </label>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              The fields marked * are required.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-black/30 hover:brightness-110 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
