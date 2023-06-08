/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Hct } from '../hct/hct.js';
import { TonalPalette } from '../palettes/tonal_palette.js';
import { DynamicScheme } from '../scheme/dynamic_scheme.js';
import { ToneDeltaConstraint } from './tone_delta_constraint.js';
/**
 * @param palette Function that provides a TonalPalette given
 * DynamicScheme. A TonalPalette is defined by a hue and chroma, so this
 * replaces the need to specify hue/chroma. By providing a tonal palette, when
 * contrast adjustments are made, intended chroma can be preserved.
 * @param tone Function that provides a tone given DynamicScheme. (useful
 * for dark vs. light mode)
 */
interface FromPaletteOptions extends BaseOptions {
    palette: (scheme: DynamicScheme) => TonalPalette;
    tone: (scheme: DynamicScheme) => number;
}
/**
 * @param hue Function with DynamicScheme input and HCT hue output.
 * @param chroma Function with DynamicScheme input and HCT chroma output.
 * @param tone Function with DynamicScheme input and HCT tone output.
 */
interface FromHueAndChromaOptions extends BaseOptions {
    hue: (scheme: DynamicScheme) => number;
    chroma: (scheme: DynamicScheme) => number;
    tone: (scheme: DynamicScheme) => number;
}
/**
 * @param argb Function with DynamicScheme input and ARGB/hex code output.
 * @param [tone=null] Function with DynamicScheme input and HCT tone output. If
 * provided, overrides tone of argb parameter.
 */
interface FromArgbOptions extends BaseOptions {
    argb: (scheme: DynamicScheme) => number;
    tone?: (scheme: DynamicScheme) => number;
}
/**
 * @param tone The tone standard.
 * @param scheme The scheme in which to adjust the tone.
 */
interface ToneContrastOptions extends BaseOptions {
    tone: (scheme: DynamicScheme) => number;
    scheme: DynamicScheme;
}
/**
 * @param [background=null] Function that provides background
 * DynamicColor given DynamicScheme. Useful for contrast, given a background,
 * colors can adjust to increase/decrease contrast.
 * @param [toneDeltaConstraint=null] Function that provides a
 * ToneDeltaConstraint given DynamicScheme. Useful for ensuring lightness
 * difference between colors that don't require contrast or have a formal
 * background/foreground relationship.
 */
interface BaseOptions {
    background?: (scheme: DynamicScheme) => DynamicColor;
    toneDeltaConstraint?: (scheme: DynamicScheme) => ToneDeltaConstraint;
}
/**
 * @param scheme Defines the conditions of the user interface, for example,
 * whether or not it is dark mode or light mode, and what the desired
 * contrast level is.
 * @param toneStandard Function with input of DynamicScheme that outputs the
 * tone to be used at default contrast.
 * @param toneToJudge Function with input of DynamicColor that outputs tone the
 * color is in the current UI state. Used to determine the tone of the
 * background.
 * @param desiredTone Function with inputs of contrast ratio with background at
 * default contrast and the background tone at current constrast level. Outputs
 * tone.
 * @param [background] Optional, function with input of DynamicScheme that
 * returns a DynamicColor that is the background of the color whose tone is
 * being calculated.
 * @param [constraint] Optional, function with input of DynamicScheme that
 * returns a ToneDeltaConstraint. If provided, the ToneDeltaConstraint is
 * enforced.
 * @param [minRatio] Optional, function with input of DynamicScheme that returns
 * the minimum contrast ratio between background and the color whose tone is
 * being calculated.
 * @param [maxRatio] Optional, function with input of DynamicScheme that returns
 * the maximum contrast ratio between background and the color whose tone is
 * being calculated.
 */
interface CalculateDynamicToneOptions {
    scheme: DynamicScheme;
    toneStandard: (scheme: DynamicScheme) => number;
    toneToJudge: (dynamicColor: DynamicColor) => number;
    desiredTone: (standardRatio: number, bgTone: number) => number;
    background?: (scheme: DynamicScheme) => DynamicColor;
    toneDeltaConstraint?: (scheme: DynamicScheme) => ToneDeltaConstraint;
    minRatio?: (scheme: number) => number;
    maxRatio?: (scheme: number) => number;
}
/**
 * A color that adjusts itself based on UI state provided by DynamicScheme.
 *
 * Colors without backgrounds do not change tone when contrast changes. Colors
 * with backgrounds become closer to their background as contrast lowers, and
 * further when contrast increases.
 *
 * Prefer static constructors. They require either a hexcode, a palette and
 * tone, or a hue and chroma. Optionally, they can provide a background
 * DynamicColor.
 */
export declare class DynamicColor {
    readonly hue: (scheme: DynamicScheme) => number;
    readonly chroma: (scheme: DynamicScheme) => number;
    readonly tone: (scheme: DynamicScheme) => number;
    readonly toneMinContrast: (scheme: DynamicScheme) => number;
    readonly toneMaxContrast: (scheme: DynamicScheme) => number;
    readonly background?: (scheme: DynamicScheme) => DynamicColor;
    readonly toneDeltaConstraint?: (scheme: DynamicScheme) => ToneDeltaConstraint;
    private readonly hctCache;
    /**
     * Create a DynamicColor defined by a TonalPalette and HCT tone.
     *
     * @param args Functions with DynamicScheme as input. Must provide a palette
     * and tone. May provide a background DynamicColor and ToneDeltaConstraint.
     */
    static fromPalette(args: FromPaletteOptions): DynamicColor;
    /**
     * Create a DynamicColor defined by a HCT hue, chroma, and tone.
     *
     * @param args Functions with DynamicScheme as input. Must provide hue,
     * chroma, and tone. May provide background DynamicColor and
     * ToneDeltaConstraint.
     */
    static fromHueAndChroma(args: FromHueAndChromaOptions): DynamicColor;
    /**
     * Create a DynamicColor from a ARGB color (hex code).
     *
     * @param args Functions with DynamicScheme as input. Must provide ARGB (hex
     * code). May provide tone that overrides hex code's, background DynamicColor,
     * and ToneDeltaConstraint.
     */
    static fromArgb(args: FromArgbOptions): DynamicColor;
    /**
     * The base constructor for DynamicColor.
     *
     * _Strongly_ prefer using one of the convenience constructors. This class is
     * arguably too flexible to ensure it can support any scenario. Functional
     * arguments allow  overriding without risks that come with subclasses.
     *
     * For example, the default behavior of adjust tone at max contrast
     * to be at a 7.0 ratio with its background is principled and
     * matches accessibility guidance. That does not mean it's the desired
     * approach for _every_ design system, and every color pairing,
     * always, in every case.
     *
     * @param hue given DynamicScheme, return the hue in HCT of the output
     * color.
     * @param chroma given DynamicScheme, return chroma in HCT of the output
     * color.
     * @param tone given DynamicScheme, return tone in HCT of the output color.
     * This tone is used for standard contrast.
     * @param toneMinContrast given DynamicScheme, return tone in HCT this color
     * should be at minimum contrast. See toneMinContrastDefault for the default
     * behavior, and strongly consider using it unless you have strong opinions
     * on color and accessibility. The convenience constructors use it.
     * @param toneMaxContrast given DynamicScheme, return tone in HCT this color
     * should be at maximum contrast. See toneMaxContrastDefault for the default
     * behavior, and strongly consider using it unless you have strong opinions
     * on color and accessibility. The convenience constructors use it.
     * @param background given DynamicScheme, return the DynamicColor that is
     * the background of this DynamicColor. When this is provided,
     * automated adjustments to lower and raise contrast are made.
     * @param toneDeltaConstraint given DynamicScheme, return a
     * ToneDeltaConstraint that describes a requirement that this
     * DynamicColor must always have some difference in tone from another
     * DynamicColor.
     *
     * Unlikely to be useful unless a design system has some distortions
     * where colors that don't have a background/foreground relationship
     * don't want to have a formal relationship or a principled value for their
     * tone distance based on common contrast / tone delta values, yet, want
     * tone distance.
     */
    constructor(hue: (scheme: DynamicScheme) => number, chroma: (scheme: DynamicScheme) => number, tone: (scheme: DynamicScheme) => number, toneMinContrast: (scheme: DynamicScheme) => number, toneMaxContrast: (scheme: DynamicScheme) => number, background?: (scheme: DynamicScheme) => DynamicColor, toneDeltaConstraint?: (scheme: DynamicScheme) => ToneDeltaConstraint);
    /**
     * Return a ARGB integer (i.e. a hex code).
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getArgb(scheme: DynamicScheme): number;
    /**
     * Return a color, expressed in the HCT color space, that this
     * DynamicColor is under the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getHct(scheme: DynamicScheme): Hct;
    /**
     * Return a tone, T in the HCT color space, that this DynamicColor is under
     * the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getTone(scheme: DynamicScheme): number;
    /**
     * Enforce a ToneDeltaConstraint between two DynamicColors.
     *
     * @param tone The desired tone of the color.
     * @param toneStandard The tone of the color at standard contrast.
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     * @param constraintProvider Given a DynamicScheme, return a
     * ToneDeltaConstraint or null.
     * @param toneToDistanceFrom Given a DynamicColor, return a tone that the
     * ToneDeltaConstraint should enforce a delta from.
     */
    static ensureToneDelta(tone: number, toneStandard: number, scheme: DynamicScheme, constraintProvider?: (scheme: DynamicScheme) => ToneDeltaConstraint | null, toneToDistanceFrom?: (color: DynamicColor) => number): number;
    /**
     * Given a background tone, find a foreground tone, while ensuring they reach
     * a contrast ratio that is as close to [ratio] as possible.
     *
     * @param bgTone Tone in HCT. Range is 0 to 100, undefined behavior when it
     *     falls outside that range.
     * @param ratio The contrast ratio desired between bgTone and the return
     *     value.
     */
    static foregroundTone(bgTone: number, ratio: number): number;
    /**
     * Core method for calculating a tone for under dynamic contrast.
     *
     * It calculates tone while enforcing these properties:
     * #1. Desired contrast ratio is reached.
     * #2. Darken to enable light foregrounds on midtones.
     * #3. Enforce tone delta constraint, if needed.
     */
    static calculateDynamicTone(args: CalculateDynamicToneOptions): number;
    /**
     * Default algorithm for calculating the tone of a color at maximum contrast.
     *
     * If the color's background has a background, reach contrast 7.0.
     * If it doesn't, maintain the original contrast ratio.
     */
    static toneMaxContrastDefault(args: ToneContrastOptions): number;
    /**
     * Default algorithm for calculating the tone of a color at minimum contrast.
     *
     * If the original contrast ratio was >= 7.0, reach contrast 4.5.
     * If the original contrast ratio was >= 3.0, reach contrast 3.0.
     * If the original contrast ratio was < 3.0, reach that ratio.
     */
    static toneMinContrastDefault(args: ToneContrastOptions): number;
    /**
     * Returns whether [tone] is <= 60.
     *
     * People prefer white foregrounds on ~T60-70. Observed over time, and also
     * by Andrew Somers during research for APCA.
     *
     * T60 used as to create the smallest discontinuity possible when skipping
     * down to T49 in order to ensure light foregrounds.
     */
    static tonePrefersLightForeground(tone: number): boolean;
    /**
     * Returns whether [tone] can reach a contrast ratio of 4.5 with a lighter
     * color.
     */
    static toneAllowsLightForeground(tone: number): boolean;
    /**
     * Adjust a tone such that white has 4.5 contrast, if the tone is
     * reasonably close to supporting it.
     */
    static enableLightForeground(tone: number): number;
}
export {};
