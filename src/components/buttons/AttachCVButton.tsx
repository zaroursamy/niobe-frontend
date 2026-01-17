import type { ComponentProps, ReactNode } from "react";

import { Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";

type AttachCVButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  label?: ReactNode;
};

export default function AttachCVButton({
  label = "Attach a CV",
  className,
  ...props
}: AttachCVButtonProps) {
  return (
    <Button type="button" className={className} variant="default" {...props}>
      <Paperclip size={16} />
      {label}
    </Button>
  );
}
