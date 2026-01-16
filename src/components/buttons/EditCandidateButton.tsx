import type { ComponentProps, ReactNode } from 'react';

import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';

type EditCandidateButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children'
> & {
  label?: ReactNode;
};

export default function EditCandidateButton({
  label = 'Edit candidate',
  className,
  ...props
}: EditCandidateButtonProps) {
  return (
    <Button type="button" className={className} variant="default" {...props}>
      <Pencil size={16} />
      {label}
    </Button>
  );
}
