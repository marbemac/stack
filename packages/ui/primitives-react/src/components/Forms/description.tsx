import * as React from 'react';

import { BoxRef } from '../Box/index.ts';
import { useFormField } from './field.tsx';

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <BoxRef ref={ref} id={formDescriptionId} tw="text-sm text-muted" {...props} />;
  },
);

FormDescription.displayName = 'FormDescription';
