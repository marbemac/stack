import { getContrast } from 'color2k';

import type { Color } from './types.js';

type ReadableColorOpts = { preferred?: Color; fallback?: Color; leeway?: number };

export const readableColor = (bg: Color, opts: ReadableColorOpts): Color => {
  const preferred = opts.preferred || '#fff';
  const fallback = opts.fallback || '#000';
  const leeway = opts.leeway || 3;

  const preferredContrast = getContrast(preferred, bg);
  if (preferredContrast > 2.5) return preferred;

  const fallbackContrast = getContrast(fallback, bg);
  const howMuchBetterIsFallbackContrast = fallbackContrast - preferredContrast;

  // Pick preferred as the readable color if it is within {leeway} contrast units of the fallback
  return howMuchBetterIsFallbackContrast <= leeway ? preferred : fallback;
};
