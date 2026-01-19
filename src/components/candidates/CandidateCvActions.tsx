import { useState } from "react";

import CVButton from "@/components/buttons/CVButton";
import AttachCVForm from "@/components/forms/AttachCVForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CandidateCvPreviewDialog from "./CandidateCvPreviewDialog";
import CandidateCvParsedDialog from "./CandidateCvParsedDialog";

type CandidateCvActionsProps = {
  candidateId: string;
  disabled?: boolean;
};

export default function CandidateCvActions({
  candidateId,
  disabled,
}: CandidateCvActionsProps) {
  const [isAttachOpen, setIsUploadOpen] = useState(false);
  const [isCvOpen, setIsPDFOpen] = useState(false);
  const [isParsedOpen, setIsIAOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CVButton
            className="shadow-sm hover:brightness-110"
            disabled={disabled}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={() => setIsPDFOpen(true)}
          >
            View PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={() => setIsIAOpen(true)}
          >
            View IA
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={() => setIsUploadOpen(true)}
          >
            Upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAttachOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach CV</DialogTitle>
            <DialogDescription>
              Upload a PDF resume for this candidate.
            </DialogDescription>
          </DialogHeader>
          <AttachCVForm
            candidateId={candidateId}
            onCancel={() => setIsUploadOpen(false)}
            onSuccess={() => setIsUploadOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CandidateCvPreviewDialog
        candidateId={candidateId}
        open={isCvOpen}
        onOpenChange={setIsPDFOpen}
      />
      <CandidateCvParsedDialog
        candidateId={candidateId}
        open={isParsedOpen}
        onOpenChange={setIsIAOpen}
      />
    </>
  );
}
