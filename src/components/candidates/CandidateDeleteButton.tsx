import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { deleteCandidate } from "@/data/candidates";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type CandidateDeleteButtonProps = {
  candidateId: string;
  disabled?: boolean;
  onDeleted?: () => void;
};

export default function CandidateDeleteButton({
  candidateId,
  disabled,
  onDeleted,
}: CandidateDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate({ from: "/candidate/$id" });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCandidate(candidateId);
      toast.success("Candidate deleted");
      onDeleted?.();
      await navigate({ to: "/candidates" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete candidate";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" disabled={disabled}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete candidate?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The candidate and their CVs will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
