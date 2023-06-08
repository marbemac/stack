// Adapted from https://github.com/JavierM42/tailwind-material-surfaces/blob/main/src/getInteractionColors.js#L4

import { parseToRgba } from 'color2k';

import { over } from './over.js';
import type { Color } from './types.js';

export const mix = (fgColor: Color, bgColor: Color, overlayOpacity: number): Color => {
  const fgRgba = parseToRgba(fgColor);
  const bgRgba = parseToRgba(bgColor);

  return `rgb(${over([fgRgba[0], fgRgba[1], fgRgba[2], overlayOpacity], bgRgba).join(',')})`;
};
