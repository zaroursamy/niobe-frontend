import { type ReactNode } from "react";
import { Badge } from "../ui/badge";

type SmallBadgeProps = {
  children: ReactNode;
};

export default function SmallBadge({ children }: SmallBadgeProps) {
  return (
    <Badge className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
      {children}
    </Badge>
  );
}
