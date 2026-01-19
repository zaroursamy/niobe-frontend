import SmallBadge from "./SmallBadge";

type CandidatePhoneBadgeProps = {
  phone: string | null;
};

export default function CandidatePhoneBadge({
  phone,
}: CandidatePhoneBadgeProps) {
  return <SmallBadge>{phone ?? "No phone"}</SmallBadge>;
}
