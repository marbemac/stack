import * as React from 'react';

import type { LabelProps, LabelRef } from '../Label/index.ts';
import { Label } from '../Label/index.ts';
import { useFormField } from './field.tsx';

export const FormLabel = React.forwardRef<LabelRef, LabelProps>(({ tw, ...props }, ref) => {
  const { formItemId } = useFormField();

  return <Label {...props} ref={ref} tw={tw} htmlFor={formItemId} />;
});

FormLabel.displayName = 'FormLabel';
