import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

type SendButtonProps = ComponentProps<typeof Button> & {
  label?: string;
};

export default function SendButton({
  className,
  label = 'Send',
  type = 'submit',
  children,
  ...props
}: SendButtonProps) {
  return (
    <Button type={type} className={className} {...props}>
      {children ?? label}
    </Button>
  );
}
