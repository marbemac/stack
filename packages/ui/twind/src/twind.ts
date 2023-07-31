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

export const css = css$;
export const cx = cx$;
export const shortcut = shortcut$;
export const apply = apply$;

export type Twind = ReturnType<typeof createTwind>;

export const createTwind = () => {
  // These 4 functions are bound to the specific tw instance (we create one per request)
  const tw = twind(twindConfig, getSheet(!IS_PROD));
  const tx = tx$.bind(tw) as typeof tx$;
  const injectGlobal = injectGlobal$.bind(tw) as typeof injectGlobal$;
  const keyframes = keyframes$.bind(tw) as typeof keyframes$;

  return { tw, css, tx, cx, shortcut, apply, injectGlobal, keyframes };
};

// Suppress twind warnings for invalid classes
// window.addEventListener('warning', event => {
//   // https://github.com/tw-in-js/twind/issues/403
//   if (event instanceof CustomEvent && event.detail.code === 'TWIND_INVALID_CLASS') {
//     event.preventDefault();
//   }
// });
