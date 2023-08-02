import { Box } from '@marbemac/ui-primitives-react';

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
};

/**
 * Input label for a form field.
 */
export function InputLabel({ name, label, required }: InputLabelProps) {
  return (
    <>
      {label && (
        <label htmlFor={name}>
          {label}{' '}
          {required && (
            <Box as="span" tw="ml-1 text-danger-solid">
              *
            </Box>
          )}
        </label>
      )}
    </>
  );
}
