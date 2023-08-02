'use client';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Box, BoxRef, forwardRef, Icon } from '@marbemac/ui-primitives-react';
import type { StyleProps } from '@marbemac/ui-styles';
import * as BaseCheckbox from '@radix-ui/react-checkbox';

type CheckboxProps = Pick<StyleProps, 'tw' | 'UNSAFE_class'> &
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root> & {
    label: string;
    error?: string;
  };

export const Checkbox = forwardRef<React.ElementRef<typeof BaseCheckbox.Root>, CheckboxProps>(
  ({ tw, UNSAFE_class, checked, ...props }, ref) => {
    return (
      <BoxRef
        as={BaseCheckbox.Root}
        ref={ref}
        checked={checked}
        tw={[
          'peer h-4 w-4 shrink-0 rounded-sm border border-neutral-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked && 'bg-primary-solid text-on-primary',
          tw,
        ]}
        UNSAFE_class={UNSAFE_class}
        {...props}
      >
        <Box as={BaseCheckbox.Indicator} tw="flex items-center justify-center text-current">
          <Icon tw="h-4 w-4" icon={faCheck} />
        </Box>
      </BoxRef>
    );
  },
);
