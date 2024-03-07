import { tx } from '../tw.ts';

export const formSpacing = {
  sm: tx('gap-1 px-2'),
  md: tx('gap-1.5 px-3.5'),
  lg: tx('gap-2 px-5'),
};

export const formSizes = {
  sm: tx('h-form-sm rounded-sm text-sm', formSpacing.sm),
  md: tx('h-form-md rounded text-base', formSpacing.md),
  lg: tx('h-form-lg rounded-lg text-base', formSpacing.lg),
};
