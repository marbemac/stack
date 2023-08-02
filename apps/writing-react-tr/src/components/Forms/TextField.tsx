import { Box, BoxRef } from '@marbemac/ui-primitives-react';
import type { StyleProps, TW_STR } from '@marbemac/ui-styles';
import type { ReadonlySignal } from '@preact/signals-react';
import { useSignal, useSignalEffect } from '@preact/signals-react';
import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { forwardRef } from 'react';

import { InputError } from './InputError.tsx';
import { InputLabel } from './InputLabel.tsx';

type TextInputProps = Pick<StyleProps, 'tw' | 'UNSAFE_class'> & {
  type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date';
  name: string;
  value: ReadonlySignal<string | number | undefined>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  inputTw?: TW_STR;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Text input field that users can type into. Various decorations can be
 * displayed in or around the field to communicate the entry requirements.
 */
export const TextField = forwardRef<HTMLInputElement, TextInputProps>(
  ({ tw, UNSAFE_class, label, value, error, inputTw, ...props }, ref) => {
    const { name, required } = props;
    const input = useSignal<string | number>('');
    useSignalEffect(() => {
      if (!Number.isNaN(value.value)) {
        input.value = value.value === undefined ? '' : value.value;
      }
    });

    return (
      <Box tw={tw} UNSAFE_class={UNSAFE_class}>
        <InputLabel name={name} label={label} required={required} />
        <BoxRef
          {...props}
          as="input"
          ref={ref}
          tw={inputTw}
          id={name}
          value={input.value ?? ''}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <InputError name={name} error={error} />
      </Box>
    );
  },
);

TextField.displayName = 'TextField';
