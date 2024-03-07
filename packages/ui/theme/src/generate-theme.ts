import {
  alphaFromArgb,
  argbFromHex,
  blueFromArgb,
  greenFromArgb,
  Hct,
  hexFromArgb,
  redFromArgb,
  TonalPalette,
} from '@material/material-color-utilities';
import type { AnyColor, ParsedRgba } from '@marbemac/utils-colors';
import { getAlphaColor, mix, readableColor } from '@marbemac/utils-colors';
import { getLuminance, mix as mix2, parseToRgba, rgba, toHex, transparentize } from 'color2k';
import deepmerge from 'deepmerge';
import mem from 'mem';
import QuickLRU from 'quick-lru';

import { INTENTS } from './consts.ts';
import type { PrebuiltThemeIds } from './prebuilt-themes.ts';
import { PREBUILT_THEMES } from './prebuilt-themes.ts';
import type {
  CanvasFoundation,
  ColorPrefix,
  FgFoundation,
  Intent,
  IntentColor,
  Shadow,
  Theme,
  ThemeColorObj,
  ThemeConfig,
} from './types.ts';
import type { CustomTheme } from './types.ts';

export type GeneratedTheme = ReturnType<typeof generateTheme>;

const $generateTheme = (baseThemeId: PrebuiltThemeIds, customTheme: CustomTheme = { colors: {} }) => {
  const theme = deepmerge(PREBUILT_THEMES[baseThemeId], customTheme) as Theme;
  const fgColor = readableColor(theme.colors.background, { preferred: theme.colors.text, fallback: '#FFF' });
  const fgLuminance = getLuminance(fgColor);
  const bgLuminance = getLuminance(theme.colors.background);
  const isDark = theme.isDark ?? fgLuminance > bgLuminance;

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

export const generateTheme = mem($generateTheme, { cacheKey: JSON.stringify, cache: new QuickLRU({ maxSize: 50 }) });

export const generateThemesForCookie = (theme: ThemeConfig | null) => {
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

const rgbaFromArgb = (argb: number): ParsedRgba => {
  return [redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb), alphaFromArgb(argb)];
};

const computeCssVariables = (theme: Theme, textColor: AnyColor, isDark: boolean): ThemeColorObj => {
  const colorVariables: Record<string, string | number> = {};
  const addColorVariables = (vars: Record<string, ParsedRgba>, prefix?: ColorPrefix) => {
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
  const bgArgb = argbFromHex(bgColor);
  const { tone: bgTone } = Hct.fromInt(bgArgb);
  const bgPalette = TonalPalette.fromInt(bgArgb);
  const neutralColor = hexFromArgb(bgPalette.tone(isDark ? 85 : 25));

  addColorVariables(canvasColors, 'canvas');
  addColorVariables(computeFgColors({ textColor, bgColor }), 'fg');

  let neutralIntentColors: Record<IntentColor<'neutral'>, ParsedRgba>;
  for (const r of INTENTS) {
    const baseColor = r === 'neutral' ? neutralColor : theme.colors[r];

    const intentColors = computeIntentColors(r, baseColor, {
      textColor,
      isDark,
      bgColor,
    });

    if (r === 'neutral') {
      neutralIntentColors = intentColors;
    }

    addColorVariables(intentColors);
  }

  addColorVariables({
    panel: isDark ? neutralIntentColors!['neutral-surface'] : [255, 255, 255, 1],
    'panel-a': isDark
      ? parseToRgba(transparentize(hexFromArgb(bgPalette.tone(bgTone + 3)), 0.4))
      : [255, 255, 255, 0.8],
    surface: isDark ? [0, 0, 0, 0.25] : [255, 255, 255, 0.9],
  });

  const shadowVariables = computeShadowColors({ isDark });

  // @ts-expect-error ignore
  return {
    ...colorVariables,
    ...shadowVariables,

    // @TODO - don't hardcode Inter... check out fontaine
    '--font-ui':
      "Inter, Inter-fallback, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    '--font-headings': `var(--font-ui)`,
    '--font-prose': `var(--font-ui)`,
    '--font-mono': `ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace`,
  };
};

const computeShadowColors = ({ isDark }: { isDark: boolean }): Record<`--shadow-${Shadow}`, string> => ({
  '--shadow-sm': `0 0 0 1px ${isDark ? '#373737' : 'rgba(0,0,0,0.055)'}, 0px 8px 40px ${
    isDark ? 'rgba(0,0,0,0.169)' : 'rgba(0,0,0,0.055)'
  }, 0px 12px 32px -16px ${isDark ? `rgba(0,0,0,0.267)` : 'rgba(0,0,0,0.055)'}`,
  '--shadow-md': `0 0 0 1px ${isDark ? '#373737' : 'rgba(0,0,0,0.055)'}, 0px 12px 60px ${
    isDark ? 'rgba(0,0,0,0.267)' : 'rgba(0,0,0,0.133)'
  }, 0px 12px 32px -16px ${isDark ? `rgba(0,0,0,0.498)` : 'rgba(0,0,0,0.133)'}`,
  '--shadow-lg': `0 0 0 1px ${isDark ? '#373737' : 'rgba(0,0,0,0.055)'}, 0px 16px 64px ${
    isDark ? 'rgba(0,0,0,0.608)' : 'rgba(0,0,0,0.169)'
  }, 0px 16px 36px -20px ${isDark ? `rgba(0,0,0,0.875)` : 'rgba(0,0,0,0.169)'}`,
});

const computeFgColors = ({
  textColor,
  bgColor,
}: {
  textColor: string;
  bgColor: string;
}): Record<FgFoundation, ParsedRgba> => ({
  default: parseToRgba(textColor),
  muted: parseToRgba(transparentize(textColor, 0.5)),
  soft: parseToRgba(transparentize(textColor, 0.65)),
  'on-emphasis': parseToRgba(transparentize(bgColor, 0.1)),
});

const computeCanvasColors = ({
  bgColor,
  isDark,
  primaryColor,
}: {
  bgColor: string;
  primaryColor: string;
  isDark?: boolean;
}): Record<CanvasFoundation, ParsedRgba> => {
  const primaryHtc = Hct.fromInt(argbFromHex(primaryColor));
  const hct = Hct.fromInt(argbFromHex(bgColor));
  const { hue, chroma, tone } = hct;

  const targetHue = tone > 98 ? primaryHtc.hue : hue;
  const tones = TonalPalette.fromHueAndChroma(targetHue, isDark ? chroma : guard(6, 20, chroma));
  const baseTone = isDark ? guard(5, 30, tone) : guard(80, 100, tone);

  return {
    inset: rgbaFromArgb(tones.tone(isDark ? baseTone - 5 : baseTone - 6)),
    default: rgbaFromArgb(tones.tone(baseTone)),
    overlay: isDark
      ? parseToRgba(transparentize(hexFromArgb(guard(0, 20, tones.tone(tone / 5) - 10)), 0.5))
      : getAlphaColor(rgbaFromArgb(tones.tone(30)), bgColor),
    emphasis: rgbaFromArgb(tones.tone(isDark ? 85 : 20)),
  };
};

const computeIntentColors = <I extends Intent>(
  intent: Readonly<I>,
  intentColor: AnyColor,
  { textColor, bgColor, isDark }: { textColor: AnyColor; bgColor: AnyColor; isDark?: boolean },
): Record<IntentColor<I>, ParsedRgba> => {
  const textRgba = parseToRgba(textColor);
  const bgRgba = parseToRgba(bgColor);

  const target = argbFromHex(toHex(intentColor));
  const { tone: bgTone, chroma: bgChroma } = Hct.fromInt(argbFromHex(toHex(bgColor)));
  const { hue, chroma, tone } = Hct.fromInt(target);

  const baseChroma = isDark ? guard(0, 70, chroma) : chroma;
  const tones = TonalPalette.fromHueAndChroma(hue, baseChroma);
  const baseTone = isDark ? guard(0, 90, tone) : guard(10, 100, tone);

  const fgTone = isDark ? guard(80, 80, tone) : guard(25, 50, tone * 0.7);
  const fg = rgbaFromArgb(tones.tone(fgTone));

  const solidHex = hexFromArgb(tones.tone(baseTone));
  const solid = parseToRgba(solidHex);
  const fgOnSolid = parseToRgba(readableColor(solidHex, { preferred: 'white', fallback: bgColor }));

  const solidHover = mix(fgOnSolid, solid, 0.15);
  const solidActive = mix(fgOnSolid, solid, 0.23);

  const softChroma = isDark ? guard(10, 90, chroma * 0.9) : guard(0, 70, chroma);
  const softTones = TonalPalette.fromHueAndChroma(hue, softChroma);
  const softBaseColor = rgbaFromArgb(softTones.tone(baseTone));

  let softVsBgToneDiff = isDark ? 100 - (baseTone - bgTone) : 100 - (bgTone - baseTone);
  softVsBgToneDiff = guard(0, 90, softVsBgToneDiff - 35);
  const toneMult = guard(1, 6, 1 + (softVsBgToneDiff / 90) * 2);
  const chromaMult = 1 + (chroma - bgChroma) / 100;

  const line = mix(softBaseColor, bgRgba, 0.2 * toneMult * chromaMult);
  const lineHover = mix(textRgba, line, 0.12);
  const lineActive = mix(textRgba, line, 0.22);

  const soft = mix(softBaseColor, bgRgba, 0.07 * toneMult * chromaMult);
  const softHover = mix(softBaseColor, bgRgba, 0.11 * toneMult * chromaMult);
  const softActive = mix(softBaseColor, bgRgba, 0.16 * toneMult * chromaMult);

  // Using mix2 so that resulting color is fully opaque, which is important for surfaces
  const surface = parseToRgba(mix2(rgba(...bgRgba), rgba(...softBaseColor), 0.035 * toneMult));

  return {
    [`${intent}-fg`]: fg,
    [`${intent}-fg-a`]: getAlphaColor(fg, bgRgba),
    [`${intent}-solid-1`]: solid,
    [`${intent}-solid-1-a`]: getAlphaColor(solid, bgRgba),
    [`${intent}-solid-2`]: solidHover,
    [`${intent}-solid-2-a`]: getAlphaColor(solidHover, bgRgba),
    [`${intent}-solid-3`]: solidActive,
    [`${intent}-solid-3-a`]: getAlphaColor(solidActive, bgRgba),
    [`${intent}-line-1`]: line,
    [`${intent}-line-1-a`]: getAlphaColor(line, bgRgba),
    [`${intent}-line-2`]: lineHover,
    [`${intent}-line-2-a`]: getAlphaColor(lineHover, bgRgba),
    [`${intent}-line-3`]: lineActive,
    [`${intent}-line-3-a`]: getAlphaColor(lineActive, bgRgba),
    [`${intent}-soft-1`]: soft,
    [`${intent}-soft-1-a`]: getAlphaColor(soft, bgRgba),
    [`${intent}-soft-2`]: softHover,
    [`${intent}-soft-2-a`]: getAlphaColor(softHover, bgRgba),
    [`${intent}-soft-3`]: softActive,
    [`${intent}-soft-3-a`]: getAlphaColor(softActive, bgRgba),
    [`${intent}-surface`]: surface,
    [`${intent}-surface-a`]: getAlphaColor(surface, bgRgba),
    [`on-${intent}`]: fgOnSolid,
    [`on-${intent}-a`]: getAlphaColor(fgOnSolid, solid),
  } as Record<IntentColor<I>, ParsedRgba>;
};
