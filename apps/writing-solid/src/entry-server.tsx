import { render as baseRender } from '@marbemac/ssr-solid/server';

import { App } from './root.tsx';
import type { RenderFn } from './server/types.ts';

export const render: RenderFn = ({ pageEvent }) => {
  pageEvent.twind.injectGlobal(`
    @font-face {
      font-display: swap;
      font-family: 'Inter';
      font-weight: 200 900;
      font-stretch: 25% 151%;
      src: url('/assets/fonts/inter/latin-variable.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
        U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* Generated with https://github.com/pixel-point/fontpie */
    @font-face {
      font-family: 'Inter-fallback';
      font-style: normal;
      font-weight: 400;
      src: local('Arial');
      ascent-override: 90%;
      descent-override: 22.43%;
      line-gap-override: 0%;
      size-adjust: 107.64%;
    }
  `);

  return baseRender({ pageEvent, Root: App });
};
