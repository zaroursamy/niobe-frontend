import CandidateCardList from "./CandidateCardList";

export type Candidate = {
  id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  experience_years: number | null;
  notes: string | null;
  status: string;
  source: string | null;
  created_at: string;
  updated_at: string;
};

type CandidateListProps = {
  candidates: Candidate[];
};

export default function CandidateList({ candidates }: CandidateListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {candidates.map((candidate) => (
        <CandidateCardList key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
