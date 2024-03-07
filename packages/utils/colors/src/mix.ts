// Adapted from https://github.com/JavierM42/tailwind-material-surfaces/blob/main/src/getInteractionColors.js#L4

import { parseToRgba } from 'color2k';

import { over } from './over.ts';
import type { AnyColor, ParsedRgba } from './types.ts';

export const mix = (
  fgColor: AnyColor | ParsedRgba,
  bgColor: AnyColor | ParsedRgba,
  overlayOpacity: number,
): ParsedRgba => {
  const fgRgba = typeof fgColor === 'string' ? parseToRgba(fgColor) : fgColor;
  const bgRgba = typeof bgColor === 'string' ? parseToRgba(bgColor) : bgColor;

  return over([fgRgba[0], fgRgba[1], fgRgba[2], overlayOpacity], bgRgba);
};
