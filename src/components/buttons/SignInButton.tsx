import { Link } from "@tanstack/react-router";

type SignInButtonProps = {
  className?: string;
};

export default function SignInButton({ className = "" }: SignInButtonProps) {
  return (
    <Link
      to="/signin"
      className={`px-4 py-2 rounded-lg font-semibold transition-all text-primary-foreground bg-primary hover:brightness-95 ${className}`}
    >
      Sign in
    </Link>
  );
}
