import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

type SignOutButtonProps = {
  onSignedOut?: () => void;
  className?: string;
};

export default function SignOutButton({
  onSignedOut,
  className = "",
}: SignOutButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      onSignedOut?.();
      setLoading(false);
      await navigate({ to: "/" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold transition-all text-destructive-foreground bg-destructive hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Signing out..." : "Log out"}
    </button>
  );
}
