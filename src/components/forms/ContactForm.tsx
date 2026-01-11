import { FormEvent } from "react";

import SendButton from "@/components/buttons/SendButton";

type ContactFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
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
        <p className="text-xs text-muted-foreground">The fields marked * are required.</p>
        <SendButton />
      </div>
    </form>
  );
}
