import type { KeyboardEvent } from "react";

import { useNavigate } from "@tanstack/react-router";

import CandidateEmailBadge from "./CandidateEmailBadge";
import type { Candidate } from "./CandidateList";

type CandidateCardListProps = {
  candidate: Candidate;
};

export default function CandidateCardList({
  candidate,
}: CandidateCardListProps) {
  const navigate = useNavigate();
  const fullName =
    `${candidate.first_name} ${candidate.last_name}`.trim() ||
    "Unnamed candidate";
  const title = candidate.title;
  const phone = candidate.phone;
  const source = candidate.source;

  const handleNavigate = () => {
    void navigate({
      to: "/candidate/$id",
      params: { id: candidate.id },
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <article
      key={candidate.id}
      className="cursor-pointer rounded-xl border border-border bg-card/40 p-6 shadow-sm backdrop-blur-sm transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      role="link"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`View ${fullName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{fullName}</h2>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <CandidateEmailBadge
          email={candidate.email}
          onClick={(event) => event.stopPropagation()}
        />
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>
          Phone: <span className="text-foreground">{phone}</span>
        </p>
        <p>Source: {source}</p>
      </div>
    </article>
  );
}
