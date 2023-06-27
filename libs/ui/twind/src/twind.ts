import {
  apply as apply$,
  css as css$,
  cx as cx$,
  getSheet,
  injectGlobal as injectGlobal$,
  keyframes as keyframes$,
  shortcut as shortcut$,
  twind,
  tx as tx$,
} from '@twind/core';

import { twindConfig } from './twind.config.js';

const IS_PROD = import.meta.env ? !import.meta.env.DEV : true;

export const tw = /* #__PURE__ */ twind(twindConfig, getSheet(!IS_PROD));
export const css = /* #__PURE__ */ css$;
export const tx = /* #__PURE__ */ tx$.bind(tw) as typeof tx$;
export const cx = /* #__PURE__ */ cx$;
export const shortcut = /* #__PURE__ */ shortcut$;
export const apply = /* #__PURE__ */ apply$;
export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw) as typeof injectGlobal$;
export const keyframes = /* #__PURE__ */ keyframes$.bind(tw) as typeof keyframes$;

// Suppress twind warnings for invalid classes
// window.addEventListener('warning', event => {
//   // https://github.com/tw-in-js/twind/issues/403
//   if (event instanceof CustomEvent && event.detail.code === 'TWIND_INVALID_CLASS') {
//     event.preventDefault();
//   }
// });
