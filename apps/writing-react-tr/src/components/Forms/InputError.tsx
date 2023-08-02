import { Box } from '@marbemac/ui-primitives-react';
import type { ReadonlySignal } from '@preact/signals-react';

import { Expandable } from './Expandable.tsx';

type InputErrorProps = {
  name: string;
  error?: ReadonlySignal<string>;
};

/**
 * Input error that tells the user what to do to fix the problem.
 */
export function InputError({ name, error }: InputErrorProps) {
  return (
    <Expandable expanded={!!error?.value}>
      <Box tw="pt-4 text-sm text-danger-solid" id={`${name}-error`}>
        {error}
      </Box>
    </Expandable>
  );
}
