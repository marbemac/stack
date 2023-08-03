import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import type { InputProps } from '../Input/index.ts';
import { Input } from '../Input/index.ts';
import { HStack } from '../Stack/index.ts';
import { FormControl } from './control.tsx';
import { FormDescription } from './description.tsx';
import { FormError } from './error.tsx';
import { FormField, FormItem } from './field.tsx';
import { FormLabel } from './label.tsx';

type FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  description?: string;
  inputProps?: InputProps;
};

export const FormInputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  inputProps,
  ...others
}: FormInputFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...others}
      render={({ field }) => (
        <FormItem>
          <HStack tw="items-center justify-between" spacing={4}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormError />
          </HStack>

          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
