import CandidateEmailBadge from "./CandidateEmailBadge";
import CandidatePhoneBadge from "./CandidatePhoneBadge";
import type { Candidate } from "./CandidateList";

type CandidateProfileProps = {
  candidate: Candidate;
};

export default function CandidateProfile({ candidate }: CandidateProfileProps) {
  const fullName =
    `${candidate.first_name} ${candidate.last_name}`.trim() ||
    "Unnamed candidate";
  const title = candidate.title;
  const experience =
    candidate.experience_years != null
      ? `${candidate.experience_years} years`
      : "";
  const source = candidate.source;
  const notes = candidate.notes;
  const formatDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  };

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">
          Candidate profile
        </p>
        <h1 className="text-3xl font-semibold">{fullName}</h1>
        <p className="text-muted-foreground">{title}</p>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Status: <span className="text-foreground">{candidate.status}</span>
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <CandidateEmailBadge email={candidate.email} />
            <CandidatePhoneBadge phone={candidate.phone} />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Source & experience
          </p>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              Source: <span className="text-foreground">{source}</span>
            </p>
            <p>
              Experience: <span className="text-foreground">{experience}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Identity
          </p>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              First name:{" "}
              <span className="text-foreground">{candidate.first_name}</span>
            </p>
            <p>
              Last name:{" "}
              <span className="text-foreground">{candidate.last_name}</span>
            </p>
            <p>
              User ID:{" "}
              <span className="text-foreground">{candidate.user_id}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Record
          </p>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              Candidate ID:{" "}
              <span className="text-foreground">{candidate.id}</span>
            </p>
            <p>
              Created:{" "}
              <span className="text-foreground">
                {formatDate(candidate.created_at)}
              </span>
            </p>
            <p>
              Updated:{" "}
              <span className="text-foreground">
                {formatDate(candidate.updated_at)}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/60 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Notes
          </p>
          <p className="mt-2 text-sm text-foreground">{notes}</p>
        </div>
      </div>
    </section>
  );
}
