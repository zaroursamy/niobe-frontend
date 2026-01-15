import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/config';

type SignOutButtonProps = {
  onSignedOut?: () => Promise<void> | void;
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
      if (onSignedOut) {
        await onSignedOut();
      } else {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
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
