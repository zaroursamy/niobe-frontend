export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
};

type CandidateListProps = {
  candidates: Candidate[];
};

export default function CandidateList({ candidates }: CandidateListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {candidates.map((candidate) => (
        <article
          key={candidate.id}
          className="rounded-xl border border-border bg-card/40 p-6 shadow-sm backdrop-blur-sm transition hover:border-primary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.email}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              #{candidate.id}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              Phone: <span className="text-foreground">{candidate.phone}</span>
            </p>
            <p>Source: {candidate.source}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
