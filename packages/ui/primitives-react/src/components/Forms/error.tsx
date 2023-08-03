import * as React from 'react';

import { BoxRef } from '../Box/index.ts';
import { useFormField } from './field.tsx';

export const FormError = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <BoxRef ref={ref} id={formMessageId} tw="text-sm text-danger-solid" {...props}>
        {body}
      </BoxRef>
    );
  },
);
FormError.displayName = 'FormError';
