import type { MouseEvent } from 'react';

type CandidateEmailBadgeProps = {
  email: string | null;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function CandidateEmailBadge({
  email,
  onClick,
}: CandidateEmailBadgeProps) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {email ? (
        <a href={`mailto:${email}`} onClick={onClick}>
          {email}
        </a>
      ) : (
        'No email'
      )}
    </span>
  );
}
