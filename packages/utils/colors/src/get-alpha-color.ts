/**
 * Original credit to radix-ui.
 *
 * Adapted from https://github.com/radix-ui/design-system/blob/master/custom/ColorTools.tsx#L1572
 */

import { parseToRgba } from 'color2k';

import type { AnyColor, ParsedRgba } from './types.ts';

function cleanRgba(color: ParsedRgba) {
  const [r, g, b, a]: (number | string)[] = color;

  return [Math.round(r), Math.round(g), Math.round(b), +a.toFixed(3)] as ParsedRgba;
}

// target = backdrop * (1 - alpha) + foreground * alpha
// alpha = (target - backdrop) / (foreground - backdrop)
export function getAlphaColor(targetColor: AnyColor | ParsedRgba, backdropColor: AnyColor | ParsedRgba): ParsedRgba {
  const [targetR, targetG, targetB] = typeof targetColor === 'string' ? parseToRgba(targetColor) : targetColor;
  const [backdropR, backdropG, backdropB] =
    typeof backdropColor === 'string' ? parseToRgba(backdropColor) : backdropColor;
  const ceil = (n: number) => Math.ceil(n * 1000) / 1000;

  // Is the backdrop color lighter, RGB-wise, than target color?
  // Decide whether we want to add as little color or as much color as possible,
  // darkening or lightening the backdrop respectively.
  // If at least one of the bits of the target RGB value
  // is lighter than the backdrop, we want to lighten it.
  const desiredRGB = targetR > backdropR ? 255 : targetG > backdropG ? 255 : targetB > backdropB ? 255 : 0;

  // Light theme example:
  // Consider a 200 120 150 target color with 255 255 255 backdrop
  // What is the alpha value that will nudge backdrop's 255 green to 120?
  //
  // Dark theme example:
  // Consider a 200 120 150 target color with 12 24 28 backdrop
  // What is the alpha value that will nudge backdrop's 12 red to 200?
  const alphaR = (targetR - backdropR) / (desiredRGB - backdropR);
  const alphaG = (targetG - backdropG) / (desiredRGB - backdropG);
  const alphaB = (targetB - backdropB) / (desiredRGB - backdropB);
  // const A = Math.min(0.02, Math.max(alphaR, alphaG, alphaB));

  // If this is gray, we go slightly simpler route using pure white/black only and normal rounding rather than ceil
  if ([alphaR, alphaG].every(n => n === alphaB)) {
    return cleanRgba([desiredRGB, desiredRGB, desiredRGB, alphaR]);
  }

  const A = ceil(Math.max(alphaR, alphaG, alphaB));

  const safeA = Math.min(1, A);

  const R = ((backdropR * (1 - safeA) - targetR) / safeA) * -1;
  const G = ((backdropG * (1 - safeA) - targetG) / safeA) * -1;
  const B = ((backdropB * (1 - safeA) - targetB) / safeA) * -1;

  return cleanRgba([R, G, B, safeA]);
}
