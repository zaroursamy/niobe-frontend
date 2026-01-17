import type { ComponentProps, ReactNode } from "react";

import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

type SeeCVButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  label?: ReactNode;
};

export default function SeeCVButton({
  label = "See CV",
  className,
  ...props
}: SeeCVButtonProps) {
  return (
    <Button type="button" className={className} variant="default" {...props}>
      <FileSearch size={16} />
      {label}
    </Button>
  );
}
