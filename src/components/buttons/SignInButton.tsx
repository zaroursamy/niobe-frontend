import type { ComponentProps } from 'react';

import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

type SignInButtonProps = Omit<
  ComponentProps<typeof Button>,
  'asChild' | 'children'
>;

export default function SignInButton({ className, ...props }: SignInButtonProps) {
  return (
    <Button asChild className={className} {...props}>
      <Link to="/signin">Sign in</Link>
    </Button>
  );
}
