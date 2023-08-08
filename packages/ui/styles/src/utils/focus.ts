import { tx } from '../tw.ts';

export const focusStyles = tx(
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
);

export const inputFocusStyles = tx(
  'outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary',
);
