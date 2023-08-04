// https://elad2412.github.io/the-new-css-reset
// Another to draw inspiration from: https://github.com/tw-in-js/twind/blob/main/packages/preset-tailwind/src/preflight.ts

import type { Preflight } from '@twind/core';

export const preflight: Preflight = {
  /**
   * Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
   * - The "symbol *" part is to solve Firefox SVG sprite bug
   */
  '*:where(:not(iframe, canvas, img, svg, video):not(svg *, symbol *))': {
    all: 'unset',
    display: 'revert',
  },

  /*
    1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
    2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
    */
  '*, *::before, *::after': {
    boxSizing: 'border-box' /* 1 */,
    borderWidth: '0' /* 2 */,
    borderStyle: 'solid' /* 2 */,
    borderColor: 'theme(borderColor.DEFAULT, currentColor)' /* 2 */,
  },

  '::before,::after': { '--tw-content': "''" },

  /*
    1. Use a consistent sensible line-height in all browsers.
    2. Prevent adjustments of font size after orientation changes in iOS.
    3. Use a more readable tab size.
    4. Use the user's configured `sans` font-family by default.
    5. Use the user's configured `sans` font-feature-settings by default.
    6. Set height and flex so that body can take up entire screen height in a way that works on mobile browsers as well
    */
  html: {
    lineHeight: 1.5 /* 1 */,
    WebkitTextSizeAdjust: '100%' /* 2 */,
    MozTabSize: '4' /* 3 */,
    tabSize: 4 /* 3 */,
    fontFamily: `theme(fontFamily.sans)` /* 4 */,
    fontFeatureSettings: 'theme(fontFamily.sans[1].fontFeatureSettings, normal)' /* 5 */,
  },

  /*
    1. Remove the margin in all browsers.
    2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
    3. Expand to take up entire viewport
    */
  body: {
    margin: '0' /* 1 */,
    lineHeight: 'inherit' /* 2 */,
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
  },

  /*
    1. Add the correct height in Firefox.
    2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
    3. Ensure horizontal rules are visible by default.
    */
  hr: { height: '0' /* 1 */, color: 'inherit', /* 2 */ borderTopWidth: '1px' /* 3 */ },

  /* Reapply the pointer cursor for anchor tags */
  a: {
    cursor: 'revert',
  },

  /* Remove list styles (bullets/numbers) */
  'ol, ul, menu': {
    listStyle: 'none',
  },

  /* For images to not be able to exceed their container */
  img: {
    maxWidth: '100%',
  },

  /* removes spacing between cells in tables */
  table: {
    borderCollapse: 'collapse',
  },

  /* revert the 'white-space' property for textarea elements on Safari */
  textarea: {
    whiteSpace: 'revert',
  },

  /* minimum style to allow to style meter element */
  meter: {
    '-webkit-appearance': 'revert',
    appearance: 'revert',
  },

  /* reset default text opacity of input placeholder */
  '::placeholder': {
    color: 'unset',
  },

  /* fix the feature of 'hidden' attribute.
 display:revert; revert to element instead of attribute */
  ':where([hidden])': {
    display: 'none',
  },

  /* revert for bug in Chromium browsers
    - fix for the content editable attribute will work properly. */
  // @ts-expect-error ignore
  ':where([contenteditable])': {
    '-moz-user-modify': 'read-write',
    '-webkit-user-modify': 'read-write',
    'overflow-wrap': 'break-word',
    '-webkit-line-break': 'after-white-space',
  },

  /* apply back the draggable feature - exist only in Chromium and Safari */
  ':where([draggable="true"])': {
    '-webkit-user-drag': 'element',
  },
};
