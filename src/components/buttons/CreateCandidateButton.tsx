import type { ComponentProps, ReactNode } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type CreateCandidateButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  label?: ReactNode;
};

export default function CreateCandidateButton({
  label = "Create candidate",
  className,
  ...props
}: CreateCandidateButtonProps) {
  return (
    <Button type="button" className={className} variant="default" {...props}>
      <Plus size={16} />
      {label}
    </Button>
  );
}
