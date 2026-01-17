import type { ComponentProps, ReactNode } from "react";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

type CVButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
  label?: ReactNode;
};

export default function CVButton({
  label = "CV",
  className,
  ...props
}: CVButtonProps) {
  return (
    <Button type="button" className={className} variant="default" {...props}>
      <FileText size={16} />
      {label}
    </Button>
  );
}
