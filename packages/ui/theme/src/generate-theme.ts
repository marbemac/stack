import {
  alphaFromArgb,
  argbFromHex,
  Blend,
  blueFromArgb,
  greenFromArgb,
  Hct,
  hexFromArgb,
  redFromArgb,
  TonalPalette,
} from '@material/material-color-utilities';
import { getLuminance, parseToRgba, rgba, saturate, toHex, transparentize } from 'color2k';
import deepmerge from 'deepmerge';

import { INTENTS } from './consts.ts';
import { mix } from './mix.ts';
import type { PrebuiltThemeIds } from './prebuilt-themes.ts';
import { PREBUILT_THEMES } from './prebuilt-themes.ts';
import { readableColor } from './readable-color.ts';
import type {
  BorderFoundation,
  CanvasFoundation,
  ColorPrefix,
  FgFoundation,
  Intent,
  IntentColor,
  Theme,
  ThemeColorObj,
  ThemeCookieVal,
} from './types.ts';
import type { RgbaColor } from './types.ts';
import type { CustomTheme } from './types.ts';

export type GeneratedTheme = ReturnType<typeof generateTheme>;

export const generateTheme = (baseThemeId: PrebuiltThemeIds, customTheme: CustomTheme = { colors: {} }) => {
  const theme = deepmerge(PREBUILT_THEMES[baseThemeId], customTheme) as Theme;
  const fgColor = readableColor(theme.colors.background, { preferred: theme.colors.text, fallback: '#FFF' });
  const fgLuminance = getLuminance(fgColor);
  const bgLuminance = getLuminance(theme.colors.background);
  const isDark = theme.isDark || fgLuminance > bgLuminance;

  const vars = computeCssVariables(theme, fgColor, isDark);

  return {
    baseThemeId,
    theme: {
      ...theme,
      isDark,
    },
    vars,
    css: {
      color: `rgb(${vars['--color-fg-default']})`,
      'background-color': `rgb(${vars['--color-canvas-default']})`,
      ...vars,
    },
  };
};

export const generateThemesForCookie = (theme: ThemeCookieVal | null) => {
  let generatedTheme;
  try {
    generatedTheme = theme ? generateTheme(theme.baseThemeId, theme.customTheme) : generateTheme('default');
  } catch (e) {
    console.error('Error generating theme', theme, e);
    generatedTheme = generateTheme('default');
  }

  const generatedDarkTheme = theme ? undefined : generateTheme('default_dark');

  return { generatedTheme, generatedDarkTheme };
};

const guard = (low: number, high: number, value: number): number => {
  return Math.min(Math.max(low, value), high);
};

const rgbaFromArgb = (argb: number): RgbaColor => {
  return [redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb), alphaFromArgb(argb)];
};

const computeCssVariables = (theme: Theme, textColor: string, isDark: boolean): ThemeColorObj => {
  const colorVariables: Record<string, string | number> = {};
  const addColorVariables = (vars: Record<string, RgbaColor>, prefix?: ColorPrefix) => {
    for (const name in vars) {
      const rgba = vars[name];
      if (!rgba) continue;

      colorVariables[`--color-${prefix ? `${prefix}-` : ''}${name}`] = [rgba[0], rgba[1], rgba[2]].join(' ');

      if (rgba.length === 4 && rgba[3] !== 1 && rgba[3] !== 255) {
        colorVariables[`--color-${prefix ? `${prefix}-` : ''}${name}-alpha`] = rgba[3];
      }
    }
  };

  const canvasColors = computeCanvasColors({
    bgColor: theme.colors.background,
    primaryColor: theme.colors.primary,
    isDark,
  });

  const bgColor = toHex(rgba(...canvasColors.default));

  addColorVariables(canvasColors, 'canvas');
  addColorVariables(computeFgColors({ textColor, bgColor }), 'fg');
  addColorVariables(computeBorderColors({ textColor }), 'border');

  for (const r of INTENTS) {
    const baseColor = r === 'neutral' ? textColor : theme.colors[r];

    const intentColors = computeIntentColors(r, toHex(baseColor || textColor), {
      textColor,
      isDark,
      bgColor,
      blend: !['primary'].includes(r),
    });

    addColorVariables(intentColors);
  }

  const shadows = computeShadows({ bgColor, isDark });

  // @ts-expect-error ignore
  return {
    ...colorVariables,

    '--shadow-sm': shadows['sm'],
    '--shadow-default': shadows['default'],
    '--shadow-md': shadows['md'],
    '--shadow-lg': shadows['lg'],
    '--shadow-xl': shadows['xl'],
    '--shadow-2xl': shadows['2xl'],
    '--shadow-inner': shadows['inner'],

    // TODO
    '--font-ui':
      "Inter, Inter-fallback, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    '--font-headings': ``,
    '--font-prose': ``,
    '--font-mono': ``,
  };
};

const computeShadows = ({ bgColor }: { bgColor: string; isDark?: boolean }) => {
  const sm = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
  const defaultShadow = '0 0px 1px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
  const md = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
  const lg = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
  const xl = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
  const xl2 = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
  const inner = 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)';

  return { sm, default: defaultShadow, md, lg, xl, '2xl': xl2, inner };
};

const computeFgColors = ({
  textColor,
  bgColor,
}: {
  textColor: string;
  bgColor: string;
}): Record<FgFoundation, RgbaColor> => ({
  default: parseToRgba(textColor),
  muted: parseToRgba(transparentize(textColor, 0.45)),
  subtle: parseToRgba(transparentize(textColor, 0.65)),
  'on-solid': parseToRgba(transparentize(bgColor, 0.1)),
});

const computeBorderColors = ({ textColor }: { textColor: string }): Record<BorderFoundation, RgbaColor> => ({
  default: parseToRgba(transparentize(textColor, 0.75)),
  muted: parseToRgba(transparentize(textColor, 0.85)),
  subtle: parseToRgba(transparentize(textColor, 0.9)),
  emphasis: parseToRgba(textColor),
});

const computeCanvasColors = ({
  bgColor,
  isDark,
  primaryColor,
}: {
  bgColor: string;
  primaryColor: string;
  isDark?: boolean;
}): Record<CanvasFoundation, RgbaColor> => {
  const primaryHtc = Hct.fromInt(argbFromHex(primaryColor));
  const hct = Hct.fromInt(argbFromHex(bgColor));
  const { hue, chroma, tone } = hct;

  const targetHue = tone > 98 ? primaryHtc.hue : hue;
  const tones = TonalPalette.fromHueAndChroma(targetHue, isDark ? chroma : guard(6, 20, chroma));
  const baseTone = isDark ? guard(5, 30, tone) : guard(80, 100, tone);

  return {
    inset: rgbaFromArgb(tones.tone(isDark ? baseTone - 5 : baseTone - 6)),
    default: rgbaFromArgb(tones.tone(baseTone)),
    subtle: rgbaFromArgb(tones.tone(isDark ? baseTone + 5 : baseTone - 5)),
    overlay: rgbaFromArgb(tones.tone(isDark ? 10 : 98)),
    emphasis: rgbaFromArgb(tones.tone(isDark ? 85 : 20)),
  };
};

const computeIntentColors = <I extends Intent>(
  intent: Readonly<I>,
  intentColor: string,
  { textColor, bgColor, isDark, blend }: { textColor: string; bgColor: string; isDark?: boolean; blend?: boolean },
): Record<IntentColor<I>, RgbaColor> => {
  let target = argbFromHex(intentColor);
  if (blend) {
    const from = target;
    const to = argbFromHex(bgColor);
    target = Blend.harmonize(from, to);
  }

  const hct = Hct.fromInt(target);
  const { hue, chroma, tone } = hct;

  const tones = TonalPalette.fromHueAndChroma(hue, chroma);
  const baseTone = isDark ? guard(0, 90, tone) : guard(10, 100, tone);

  const fg = rgbaFromArgb(tones.tone(isDark ? guard(80, 90, tone) : guard(30, 60, tone)));

  const solid = hexFromArgb(tones.tone(baseTone));
  const fgOnSolid = readableColor(solid, { preferred: 'white', fallback: bgColor });
  const fgOnNeutral = readableColor(textColor, {
    preferred: saturate(hexFromArgb(tones.tone(isDark ? 45 : 25)), 0.5),
    fallback: fgOnSolid,
  });

  const solidHover = mix(fgOnSolid, solid, 0.12);
  const solidActive = mix(fgOnSolid, solid, 0.2);
  const solidGradient = rgbaFromArgb(tones.tone(isDark ? 50 : 50));

  const subtleChroma = isDark ? guard(10, 100, chroma * 0.9) : guard(0, 80, chroma);
  const subtleTones = TonalPalette.fromHueAndChroma(hue, subtleChroma);
  const subtleTone = isDark ? guard(65, 80, baseTone) : guard(40, 90, baseTone);
  const subtleBaseColor = hexFromArgb(subtleTones.tone(subtleTone));

  const subtle = mix(subtleBaseColor, bgColor, 0.14);
  const subtleHover = mix(subtleBaseColor, bgColor, 0.2);
  const subtleActive = mix(subtleBaseColor, bgColor, 0.3);

  return {
    [`${intent}-fg`]: fg,
    [`${intent}-solid`]: parseToRgba(solid),
    [`${intent}-solid-hover`]: parseToRgba(solidHover),
    [`${intent}-solid-active`]: parseToRgba(solidActive),
    [`${intent}-solid-gradient`]: solidGradient,
    [`${intent}-subtle`]: parseToRgba(subtle),
    [`${intent}-subtle-hover`]: parseToRgba(subtleHover),
    [`${intent}-subtle-active`]: parseToRgba(subtleActive),
    [`on-${intent}`]: parseToRgba(fgOnSolid),
    [`${intent}-on-neutral`]: parseToRgba(fgOnNeutral),
  } as Record<IntentColor<I>, RgbaColor>;
};
