type CandidatePhoneBadgeProps = {
  phone: string | null;
};

export default function CandidatePhoneBadge({
  phone,
}: CandidatePhoneBadgeProps) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {phone ?? 'No phone'}
    </span>
  );
}
