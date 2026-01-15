import CandidateCardList from "./CandidateCardList";

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  source: string;
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
