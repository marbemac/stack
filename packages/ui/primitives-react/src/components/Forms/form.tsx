import type { StyleProps } from '@marbemac/ui-styles';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

import { BoxRef } from '../Box/index.ts';

export const Form = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  methods,
  ...others
}: StyleProps &
  React.HTMLAttributes<HTMLFormElement> & {
    methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  }) => {
  return (
    <FormProvider {...methods}>
      <BoxRef as="form" {...others} />
    </FormProvider>
  );
};

// export const Form = FormProvider;
