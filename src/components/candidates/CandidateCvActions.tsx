import { useState } from 'react';

import CVButton from '@/components/buttons/CVButton';
import AttachCVForm from '@/components/forms/AttachCVForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CandidateCvPreviewDialog from './CandidateCvPreviewDialog';

type CandidateCvActionsProps = {
  candidateId: string;
  disabled?: boolean;
};

export default function CandidateCvActions({
  candidateId,
  disabled,
}: CandidateCvActionsProps) {
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

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
          <DropdownMenuItem onSelect={() => setIsCvOpen(true)}>
            See CV
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsAttachOpen(true)}>
            Upload CV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAttachOpen} onOpenChange={setIsAttachOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach CV</DialogTitle>
            <DialogDescription>
              Upload a PDF resume for this candidate.
            </DialogDescription>
          </DialogHeader>
          <AttachCVForm
            candidateId={candidateId}
            onCancel={() => setIsAttachOpen(false)}
            onSuccess={() => setIsAttachOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CandidateCvPreviewDialog
        candidateId={candidateId}
        open={isCvOpen}
        onOpenChange={setIsCvOpen}
      />
    </>
  );
}
