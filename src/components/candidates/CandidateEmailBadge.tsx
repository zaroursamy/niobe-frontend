import type { MouseEvent } from "react";
import SmallBadge from "./SmallBadge";

type CandidateEmailBadgeProps = {
  email: string | null;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function CandidateEmailBadge({
  email,
  onClick,
}: CandidateEmailBadgeProps) {
  return (
    <SmallBadge>
      {email ? (
        <a href={`mailto:${email}`} onClick={onClick}>
          {email}
        </a>
      ) : (
        "No email"
      )}
    </SmallBadge>
  );
}
