import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Sparkles,
  Upload,
} from "lucide-react";

import ContactButton from "@/components/buttons/ContactButton";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const features = [
    {
      icon: <Upload className="w-12 h-12 text-[var(--color-primary)]" />,
      title: "Import your pipeline",
      description:
        "Upload CV folders or ATS exports in one move; everything is organized by role.",
    },
    {
      icon: <ClipboardList className="w-12 h-12 text-[var(--color-chart-3)]" />,
      title: "Extract deep insights",
      description:
        "Summaries, highlights, and risks pulled from every CV automatically—at scale.",
    },
    {
      icon: <Sparkles className="w-12 h-12 text-[var(--color-accent)]" />,
      title: "IA scoring",
      description:
        "Every profile is scored automatically against your must-haves.",
    },
    {
      icon: <ArrowRight className="w-12 h-12 text-[var(--color-ring)]" />,
      title: "Surface top matches",
      description:
        "See the strongest candidates per role instantly, even across hundreds of resumes.",
    },
    {
      icon: <CheckCircle2 className="w-12 h-12 text-[var(--color-chart-4)]" />,
      title: "Decide with confidence",
      description:
        "Share concise shortlists with hiring teams so decisions happen faster.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground bg-gradient-to-b from-background via-accent/10 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -right-10 top-10 h-64 w-64 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--color-primary) 30%, transparent)",
          }}
        />
        <div
          className="absolute -left-10 top-64 h-64 w-64 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--color-chart-3) 30%, transparent)",
          }}
        />
        <div
          className="absolute left-1/2 bottom-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--color-accent) 30%, transparent)",
          }}
        />
      </div>

      <section className="relative px-6 pt-20 pb-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 text-center">
          <div className="w-full space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight [letter-spacing:-0.04em]">
              The hiring co-pilot built for recruiters.
            </h1>
            <p className="text-lg text-muted-foreground">
              Get automatic scoring for selecting the best candidates.
              <br />
              Get recommendations during interviews for asking accurate
              questions.
              <br />
              Reduce risks of hiring the wrong profiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <ContactButton className="shadow-lg shadow-black/30 hover:brightness-110 gap-2">
                Book a demo
                <ArrowRight className="w-4 h-4" />
              </ContactButton>
              <a
                href="#how-it-works"
                className="text-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative px-6 py-16 border-t border-border bg-gradient-to-b from-background/90 to-background"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
                Handle hundreds of resumes for the roles that matter.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card/15 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
