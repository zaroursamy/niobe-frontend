import { useState } from "react";

import EditCandidateButton from "@/components/buttons/EditCandidateButton";
import type { Candidate } from "@/components/candidates/CandidateList";
import EditCandidateForm from "@/components/forms/EditCandidateForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CandidateEditDialogProps = {
  candidate: Candidate;
  onUpdated?: () => void;
};

export default function CandidateEditDialog({
  candidate,
  onUpdated,
}: CandidateEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <EditCandidateButton className="shadow-sm hover:brightness-110" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit candidate</DialogTitle>
          <DialogDescription>
            Update the candidate details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <EditCandidateForm
          candidate={candidate}
          onCancel={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            onUpdated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
