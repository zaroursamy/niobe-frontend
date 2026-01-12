import type { ComponentProps } from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type SignUpButtonProps = Omit<
  ComponentProps<typeof Button>,
  "asChild" | "children"
>;

export default function SignUpButton({
  className,
  variant = "secondary",
  ...props
}: SignUpButtonProps) {
  return (
    <Button asChild className={className} variant={variant} {...props}>
      <Link to="/auth/signup">Sign up</Link>
    </Button>
  );
}
