import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Checkbox as Kobalte } from '@kobalte/core';
import { Box } from '@marbemac/ui-primitives-solid';

import { cn } from '~/utils/cn.ts';

import { Icon } from './Icon.tsx';

type CheckboxProps = Kobalte.CheckboxRootProps & {
  label: string;
  error?: string;
};

export function Checkbox(props: CheckboxProps) {
  return (
    <Kobalte.Root
      {...props}
      validationState={props.error ? 'invalid' : 'valid'}
      class={cn(props.class, 'inline-flex items-center gap-2')}
    >
      <Kobalte.Input />

      <Box
        as={Kobalte.Control}
        tw="inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-solid bg-neutral-subtle data-[checked]:border-transparent data-[checked]:bg-primary-solid data-[checked]:text-white"
      >
        <Kobalte.Indicator>
          <Icon icon={faCheck} />
        </Kobalte.Indicator>
      </Box>

      <Kobalte.Label class="select-none">{props.label}</Kobalte.Label>
    </Kobalte.Root>
  );
}
