import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

type SignOutButtonProps = {
  onSignedOut?: () => void;
  className?: string;
};

export default function SignOutButton({
  onSignedOut,
  className,
}: SignOutButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      onSignedOut?.();
      setLoading(false);
      await navigate({ to: '/' });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      variant="destructive"
      className={className}
    >
      {loading ? 'Signing out...' : 'Log out'}
    </Button>
  );
}
