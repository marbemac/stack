import { forwardRef as baseForwardRef } from 'react';

// Declare a type that works with
// generic components
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

// Cast the old forwardRef to the new one
export const forwardRefWithGeneric = baseForwardRef as FixedForwardRef;
