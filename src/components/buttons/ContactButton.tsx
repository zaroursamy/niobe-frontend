import type { ComponentProps, ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type ContactButtonProps = Omit<ComponentProps<typeof Button>, "asChild"> & {
  children?: ReactNode;
};

export default function ContactButton({
  className,
  children = "Demo",
  ...props
}: ContactButtonProps) {
  return (
    <Button variant="outline" asChild className={className} {...props}>
      <Link to="/contact">{children}</Link>
    </Button>
  );
}
