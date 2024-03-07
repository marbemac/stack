import type { HslColor } from './types.ts';

const range = function (hash: number, min: number, max: number) {
  const diff = max - min;
  const x = ((hash % diff) + diff) % diff;
  return x + min;
};

export const stringToColor = (
  str: string,
  $opts?: { h?: [number, number]; s?: [number, number]; l?: [number, number] },
): HslColor => {
  try {
    const opts = $opts || {};

    // allow any hue
    opts.h = opts.h || [0, 360];

    // limit saturation - we generally like saturation to keep things "pop-y", but too much saturation and white text gets difficult to read
    opts.s = opts.s || [60, 80];

    // ditto above re carefully selecting the range here to balance variability with readability of white text
    opts.l = opts.l || [30, 65];

    let hash = 0;
    if (str.length === 0) return '#FFF';

    for (let i = 0; i < str.length; i++) {
      hash = (str.charCodeAt(i) % 96) * 14 + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const h = range(hash, opts.h[0], opts.h[1]);
    const s = range(hash, opts.s[0], opts.s[1]);

    /**
     * HSL's lightness doesn't tend to correspond well to how light or dark your eyes see colors
     * The simple solution is to darken yellows and cyans and lighten your blues a little bit
     */
    let minL = opts.l[0];
    let maxL = opts.l[1];
    const isCyan = h > 155 && h < 205;
    const isYellow = h > 35 && h < 85;
    const isBlue = h > 215 && h < 265;
    if (isCyan || isYellow) maxL -= 15;
    if (isBlue) minL += 10;

    const l = range(hash, minL, maxL);

    return `hsl(${h}, ${s}%, ${l}%)`;
  } catch (e) {
    console.warn(`stringToColor.error - could not parse color string ${str}`);
    return 'hsl(360, 100%, 100%)';
  }
};
