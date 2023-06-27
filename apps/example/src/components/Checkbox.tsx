import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Checkbox as Kobalte } from '@kobalte/core';

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

      <Kobalte.Control class="inline-flex justify-center items-center h-5 w-5 rounded border border-gray-400 bg-gray-100 data-[checked]:border-transparent data-[checked]:bg-sky-500 data-[checked]:text-white">
        <Kobalte.Indicator>
          <Icon icon={faCheck} />
        </Kobalte.Indicator>
      </Kobalte.Control>

      <Kobalte.Label class="select-none">{props.label}</Kobalte.Label>
    </Kobalte.Root>
  );
}
