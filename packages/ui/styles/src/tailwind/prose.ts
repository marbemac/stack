import basePlugin from 'tailwindcss/plugin';

import { tx } from '../tw.ts';

type ProsePluginOpts = {};

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = (px: number) => `${round(px / 16)}rem`;
const em = (px: number, base: number) => `${round(px / base)}em`;

export const prosePlugin = basePlugin.withOptions((options: ProsePluginOpts = {}) => {
  return ({ addComponents }) => {
    addComponents({
      '.ui-prose': {
        [`@apply ${tx('text-fg/90')}`]: {},

        // prose related variables
        '--prose-font-size': rem(16),

        fontSize: 'var(--prose-font-size)',
        lineHeight: round(24 / 16),

        '> :first-child': {
          marginTop: '0',
        },
        '> :last-child': {
          marginBottom: '0',
        },

        p: {
          marginTop: em(16, 16),
          marginBottom: em(16, 16),

          '&:first-child': {
            marginTop: '0px',
          },

          '&:last-child': {
            marginBottom: '0px',
          },
        },
        a: {
          [`@apply ${tx('font-medium text-link underline')}`]: {},
        },
        strong: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
        },
        'a strong': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'blockquote strong': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'th strong': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        ol: {
          [`@apply ${tx('list-decimal')}`]: {},
          marginTop: em(20, 16),
          marginBottom: em(20, 16),
          paddingLeft: em(26, 16),
        },
        'ol[type="A"]': {
          listStyleType: 'upper-alpha',
        },
        'ol[type="a"]': {
          listStyleType: 'lower-alpha',
        },
        'ol[type="A" s]': {
          listStyleType: 'upper-alpha',
        },
        'ol[type="a" s]': {
          listStyleType: 'lower-alpha',
        },
        'ol[type="I"]': {
          listStyleType: 'upper-roman',
        },
        'ol[type="i"]': {
          listStyleType: 'lower-roman',
        },
        'ol[type="I" s]': {
          listStyleType: 'upper-roman',
        },
        'ol[type="i" s]': {
          listStyleType: 'lower-roman',
        },
        'ol[type="1"]': {
          listStyleType: 'decimal',
        },
        ul: {
          listStyleType: 'disc',
          marginTop: em(20, 16),
          marginBottom: em(20, 16),
          paddingLeft: em(26, 16),
        },
        li: {
          marginTop: em(12, 16),
          marginBottom: em(12, 16),
        },
        'li p': {
          marginTop: em(12, 16),
          marginBottom: em(12, 16),
        },
        'li > *:first-child': {
          marginTop: '0',
        },
        '> ul p + *:last-child': {
          marginBottom: em(12, 16),
        },
        '> ol p + *:last-child': {
          marginBottom: em(12, 16),
        },
        'ol > li': {
          paddingLeft: em(6, 16),
        },
        'ul > li': {
          paddingLeft: em(6, 16),
        },
        'ul ul, ul ol, ol ul, ol ol': {
          marginTop: em(8, 16),
          marginBottom: em(8, 16),
        },
        'ol > li::marker': {
          [`@apply ${tx('font-normal text-muted')}`]: {},
        },
        'ul > li::marker': {
          [`@apply ${tx('text-soft')}`]: {},
        },
        dl: {
          marginTop: em(20, 16),
          marginBottom: em(20, 16),
        },
        dt: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
          marginTop: em(20, 16),
        },
        dd: {
          marginTop: em(8, 16),
          paddingLeft: em(26, 16),
        },
        hr: {
          [`@apply ${tx('text-soft/80')}`]: {},
          borderTopWidth: '1px',
          marginTop: em(48, 16),
          marginBottom: em(48, 16),
        },
        'hr + *': {
          marginTop: '0',
        },
        'h2 + *': {
          marginTop: '0',
        },
        'h3 + *': {
          marginTop: '0',
        },
        'h4 + *': {
          marginTop: '0',
        },
        blockquote: {
          [`@apply ${tx('border-l-neutral-line-1-a font-medium text-fg')}`]: {},
          borderLeftWidth: '0.25rem',
          quotes: '"\\201C""\\201D""\\2018""\\2019"',
          marginTop: em(32, 20),
          marginBottom: em(32, 20),
          paddingLeft: em(20, 20),
        },
        h1: {
          [`@apply ${tx('font-bold text-fg')}`]: {},
          fontSize: em(36, 16),
          marginTop: '0',
          marginBottom: em(36, 36),
          lineHeight: round(40 / 36),
        },
        'h1 strong': {
          [`@apply ${tx('font-extrabold text-inherit')}`]: {},
        },
        h2: {
          [`@apply ${tx('font-bold text-fg')}`]: {},
          fontSize: em(24, 16),
          marginTop: em(42, 24),
          marginBottom: em(24, 24),
          lineHeight: round(32 / 24),
        },
        'h2 strong': {
          [`@apply ${tx('font-extrabold text-inherit')}`]: {},
        },
        h3: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
          fontSize: em(20, 16),
          marginTop: em(36, 20),
          marginBottom: em(12, 20),
          lineHeight: round(32 / 20),
        },
        'h3 strong': {
          [`@apply ${tx('font-bold text-inherit')}`]: {},
        },
        h4: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
          marginTop: em(28, 16),
          marginBottom: em(8, 16),
          lineHeight: round(24 / 16),
        },
        'h4 strong': {
          [`@apply ${tx('font-bold text-inherit')}`]: {},
        },
        img: {
          marginTop: em(32, 16),
          marginBottom: em(32, 16),
        },
        picture: {
          [`@apply ${tx('block')}`]: {},
          marginTop: em(32, 16),
          marginBottom: em(32, 16),
        },
        'picture > img': {
          marginTop: '0',
          marginBottom: '0',
        },
        video: {
          marginTop: em(32, 16),
          marginBottom: em(32, 16),
        },
        kbd: {
          [`@apply ${tx('font-inherit font-medium text-fg shadow-border')}`]: {},
          fontSize: em(14, 16),
          borderRadius: rem(5),
          paddingTop: em(3, 16),
          paddingRight: em(6, 16),
          paddingBottom: em(3, 16),
          paddingLeft: em(6, 16),
        },
        code: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
          fontSize: em(14, 16),
        },
        'a code': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'h1 code': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'h2 code': {
          [`@apply ${tx('text-inherit')}`]: {},
          fontSize: em(21, 24),
        },
        'h3 code': {
          [`@apply ${tx('text-inherit')}`]: {},
          fontSize: em(18, 20),
        },
        'h4 code': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'blockquote code': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        'th code': {
          [`@apply ${tx('text-inherit')}`]: {},
        },
        pre: {
          [`@apply ${tx('overflow-x-auto bg-canvas-emphasis font-normal text-on-emphasis')}`]: {},
          fontSize: em(14, 16),
          lineHeight: round(24 / 14),
          marginTop: em(24, 14),
          marginBottom: em(24, 14),
          borderRadius: rem(6),
          paddingTop: em(12, 14),
          paddingRight: em(16, 14),
          paddingBottom: em(12, 14),
          paddingLeft: em(16, 14),
        },
        'pre code': {
          backgroundColor: 'transparent',
          borderWidth: '0',
          borderRadius: '0',
          padding: '0',
          fontWeight: 'inherit',
          color: 'inherit',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit',
        },
        'pre code::before': {
          content: 'none',
        },
        'pre code::after': {
          content: 'none',
        },
        table: {
          [`@apply ${tx('overflow-x-auto font-normal')}`]: {},
          width: '100%',
          tableLayout: 'auto',
          textAlign: 'left',
          marginTop: em(32, 16),
          marginBottom: em(32, 16),
          fontSize: em(14, 16),
          lineHeight: round(24 / 14),
        },
        thead: {
          [`@apply ${tx('border-b-neutral-line-1-a')}`]: {},
          borderBottomWidth: '1px',
        },
        th: {
          [`@apply ${tx('font-semibold text-fg')}`]: {},
          verticalAlign: 'bottom',
          paddingRight: em(8, 14),
          paddingBottom: em(8, 14),
          paddingLeft: em(8, 14),
        },
        'th:first-child': {
          paddingLeft: '0',
        },
        'th:last-child': {
          paddingRight: '0',
        },
        'tbody td, tfoot td': {
          paddingTop: em(8, 14),
          paddingRight: em(8, 14),
          paddingBottom: em(8, 14),
          paddingLeft: em(8, 14),
        },
        'tbody tr': {
          [`@apply ${tx('border-b-neutral-line-1-a')}`]: {},
          borderBottomWidth: '1px',
        },
        'tbody tr:last-child': {
          borderBottomWidth: '0',
        },
        'tbody td:first-child, tfoot td:first-child': {
          paddingLeft: '0',
        },
        'tbody td:last-child, tfoot td:last-child': {
          paddingRight: '0',
        },
        'tbody td': {
          verticalAlign: 'baseline',
        },
        tfoot: {
          [`@apply ${tx('border-t-neutral-line-1-a')}`]: {},
          borderTopWidth: '1px',
        },
        'tfoot td': {
          verticalAlign: 'top',
        },
        figure: {
          marginTop: em(32, 16),
          marginBottom: em(32, 16),
        },
        'figure > *': {
          marginTop: '0',
          marginBottom: '0',
        },
        figcaption: {
          [`@apply ${tx('text-soft')}`]: {},
          fontSize: em(14, 16),
          lineHeight: round(20 / 14),
          marginTop: em(12, 14),
        },
      },

      '.ui-prose-sm': {
        '--prose-font-size': rem(14),
      },
    });
  };
});
