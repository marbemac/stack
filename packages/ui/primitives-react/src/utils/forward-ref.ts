import { forwardRef as baseForwardRef } from 'react';
import type { PolymorphicComponent, PolyRefFunction } from 'react-polymorphed';

// Declare a type that works with
// generic components
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

// Cast the old forwardRef to the new one
export const forwardRef = baseForwardRef as FixedForwardRef;

export const polyRef = baseForwardRef as PolyRefFunction;

export type { PolymorphicComponent };
