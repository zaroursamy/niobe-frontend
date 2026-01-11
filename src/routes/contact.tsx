import { createFileRoute } from "@tanstack/react-router";

import ContactForm from "@/components/forms/ContactForm";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/10 to-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto bg-card/20 border border-border rounded-2xl p-10 backdrop-blur-sm shadow-2xl shadow-black/30">
        <div className="space-y-3 text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Contact</p>
          <h1 className="text-4xl font-bold">Book a demo</h1>
          <p className="text-muted-foreground">
            Tell us who you are and we will reach out with a tailored walkthrough.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
