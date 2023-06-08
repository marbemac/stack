// Adapted from https://github.com/colorjs/color-composite/blob/master/index.js

import type { RgbaColor } from './types';

export const over = (a: RgbaColor, b: RgbaColor): RgbaColor => {
  const aAlpha = a[3];
  const bAlpha = b[3];

  if (aAlpha === 1) {
    return a;
  } else if (aAlpha === 0) {
    return b;
  }

  const o = [b[0], b[1], b[2], aAlpha + bAlpha * (1 - aAlpha)] as RgbaColor;
  const oAlpha = o[3];

  // Color channels
  for (let i = 0; i < 3; i++) {
    const preA = a[i]! * aAlpha;
    const preB = b[i]! * bAlpha;
    o[i] = Math.round((preA + preB * (1 - aAlpha)) / oAlpha);
  }

  return o;
};
