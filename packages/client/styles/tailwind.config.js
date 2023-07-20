var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// /Users/marc/dev/marbemac/node_modules/tailwindcss/lib/util/createPlugin.js
var require_createPlugin = __commonJS((exports) => {
  var createPlugin = function(plugin, config) {
    return {
      handler: plugin,
      config
    };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
      return _default;
    }
  });
  createPlugin.withOptions = function(pluginFunction, configFunction = () => ({})) {
    const optionsFunction = function(options) {
      return {
        __options: options,
        handler: pluginFunction(options),
        config: configFunction(options)
      };
    };
    optionsFunction.__isOptionsFunction = true;
    optionsFunction.__pluginFunction = pluginFunction;
    optionsFunction.__configFunction = configFunction;
    return optionsFunction;
  };
  var _default = createPlugin;
});

// /Users/marc/dev/marbemac/node_modules/tailwindcss/lib/public/create-plugin.js
var require_create_plugin = __commonJS((exports) => {
  var _interop_require_default = function(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
      return _default;
    }
  });
  var _createPlugin = _interop_require_default(require_createPlugin());
  var _default = _createPlugin.default;
});

// /Users/marc/dev/marbemac/node_modules/tailwindcss/plugin.js
var require_plugin = __commonJS((exports, module) => {
  var createPlugin = require_create_plugin();
  module.exports = (createPlugin.__esModule ? createPlugin : { default: createPlugin }).default;
});

// /Users/marc/dev/marbemac/libs/ui/theme/src/consts.ts
var INTENTS = ["neutral", "primary", "success", "warning", "danger"];
// src/theme.ts
var linear = function(stop, unit = "", divideBy = 1, start = 0, step = 1, result = {}) {
  for (;start <= stop; start += step) {
    result[start] = start / divideBy + unit;
  }
  return result;
};
var colorWithOpacity = (name, group) => `rgb(var(--color-${name}) / calc(var(--color-${name}-alpha, 1) * ${group ? `var(--tw-${group}-opacity, 1)` : "<alpha-value>"}))`;
var computeIntentColors = (intent, group) => ({
  [`${intent}-solid`]: colorWithOpacity(`${intent}-solid`, group),
  [`${intent}-solid-hover`]: colorWithOpacity(`${intent}-solid-hover`, group),
  [`${intent}-solid-active`]: colorWithOpacity(`${intent}-solid-active`, group),
  [`${intent}-solid-gradient`]: colorWithOpacity(`${intent}-solid-gradient`, group),
  [`${intent}-subtle`]: colorWithOpacity(`${intent}-subtle`, group),
  [`${intent}-subtle-hover`]: colorWithOpacity(`${intent}-subtle-hover`, group),
  [`${intent}-subtle-active`]: colorWithOpacity(`${intent}-subtle-active`, group),
  [`on-${intent}`]: colorWithOpacity(`on-${intent}`, group),
  [`${intent}-on-neutral`]: colorWithOpacity(`${intent}-on-neutral`, group)
});
var commonColors = (group) => {
  const intentColors = {};
  for (const r of INTENTS) {
    Object.assign(intentColors, computeIntentColors(r, group));
  }
  const colors = {
    current: "currentColor",
    transparent: "transparent",
    white: "#FFF",
    black: "#000",
    ...intentColors
  };
  return colors;
};
var textColors = () => {
  const intentColors = {};
  for (const r of INTENTS) {
    intentColors[`${r}-fg`] = colorWithOpacity(`${r}-fg`, "text");
  }
  return {
    fg: colorWithOpacity("fg-default", "text"),
    "fg-muted": colorWithOpacity("fg-muted", "text"),
    "fg-subtle": colorWithOpacity("fg-subtle", "text"),
    "fg-on-solid": colorWithOpacity("fg-on-solid", "text"),
    ...intentColors
  };
};
var backgroundColors = () => {
  return {
    canvas: colorWithOpacity("canvas-default", "bg"),
    "canvas-overlay": colorWithOpacity("canvas-overlay", "bg"),
    "canvas-inset": colorWithOpacity("canvas-inset", "bg"),
    "canvas-subtle": colorWithOpacity("canvas-subtle", "bg"),
    "canvas-emphasis": colorWithOpacity("canvas-emphasis", "bg")
  };
};
var borderColors = () => {
  return {
    DEFAULT: colorWithOpacity("border-default", "border"),
    muted: colorWithOpacity("border-muted", "border"),
    subtle: colorWithOpacity("border-subtle", "border"),
    emphasis: colorWithOpacity("border-emphasis", "border")
  };
};
var textColor = {
  ...commonColors("text"),
  ...textColors()
};
var backgroundColor = {
  ...commonColors("bg"),
  ...backgroundColors()
};
var borderColor = {
  ...commonColors("border"),
  ...borderColors()
};
var strokeColor = {
  current: "currentColor"
};
var strokeWidth = {
  current: "currentColor"
};
var borderRadius = {
  none: "0px",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px"
};
var boxShadow = {
  sm: "var(--shadow-sm)",
  DEFAULT: "var(--shadow-default)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  "2xl": "var(--shadow-2xl)",
  inner: "var(--shadow-inner)"
};
var fontFamily = {
  sans: "var(--font-ui)",
  ui: "var(--font-ui)",
  prose: "var(--font-prose)",
  mono: "var(--font-mono)"
};
var fontSize = {
  "2xs": ["0.625rem", "0.75rem"],
  xs: ["0.6875rem", "0.75rem"],
  sm: ["0.75rem", "1rem"],
  base: ["0.875rem", "1.25rem"],
  lg: ["1rem", "1.5rem"],
  xl: ["1.125rem", "1.75rem"],
  "2xl": ["1.25rem", "1.75rem"],
  "3xl": ["1.5rem", "2rem"],
  "4xl": ["1.875rem", "2.25rem"],
  "5xl": ["2.25rem", "2.5rem"],
  "6xl": ["3rem", "1"],
  "7xl": ["3.75rem", "1"],
  "8xl": ["4.5rem", "1"],
  "paragraph-leading": "var(--fs-paragraph-leading)",
  paragraph: "var(--fs-paragraph)",
  "paragraph-small": "var(--fs-paragraph-small)",
  "paragraph-tiny": "var(--fs-paragraph-tiny)"
};
var fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
};
var extendLineHeight = {
  zero: "0",
  "paragraph-leading": "var(--lh-paragraph-leading)",
  paragraph: "var(--lh-paragraph)",
  "paragraph-small": "var(--lh-paragraph-small)",
  "paragraph-tiny": "var(--lh-paragraph-tiny)"
};
var extendSpacing = {
  18: "4.5rem",
  112: "28rem",
  128: "32rem",
  144: "36rem",
  160: "40rem"
};
var extendHeight = {
  ...extendSpacing,
  xs: "20px",
  sm: "24px",
  md: "32px",
  lg: "36px",
  xl: "44px",
  "2xl": "52px",
  "3xl": "60px"
};
var extendWidth = {
  ...extendSpacing,
  xs: "20px",
  sm: "24px",
  md: "32px",
  lg: "36px",
  xl: "44px",
  "2xl": "52px",
  "3xl": "60px"
};
var extendzIndex = {
  "-1": "-1"
};
var extendPlacecholderColor = {
  DEFAULT: "var(--color-text-muted)"
};
var backgroundImage = {
  none: "none",
  "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
  "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
  "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
  "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
  "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
  "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
  "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
  "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
};
var animation = {
  "spin-slow": "spin 2s linear infinite"
};
var themeObj = {
  screens: {
    lg: { min: "1280px" },
    md: { max: "1279px" },
    sm: { max: "767px" }
  },
  opacity: {
    ...linear(100, "", 100, 0, 5)
  },
  backgroundColor,
  backgroundImage,
  borderColor,
  borderRadius,
  boxShadow,
  colors: backgroundColor,
  fontFamily,
  fontSize,
  fontWeight,
  stroke: strokeColor,
  strokeWidth,
  textColor,
  extend: {
    lineHeight: extendLineHeight,
    height: extendHeight,
    placeholderColor: extendPlacecholderColor,
    width: extendWidth,
    zIndex: extendzIndex,
    spacing: extendSpacing,
    animation
  }
};

// src/tailwind-config.ts
var plugin = __toESM(require_plugin(), 1);
var tailwind_config_default = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: themeObj,
  plugins: [
    plugin.default(function({ addComponents }) {
      addComponents({
        ".btn": {
          padding: ".5rem 1rem",
          borderRadius: ".25rem",
          fontWeight: "600"
        },
        ".btn-blue": {
          backgroundColor: "#3490dc",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#2779bd"
          }
        },
        ".btn-red": {
          backgroundColor: "#e3342f",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#cc1f1a"
          }
        }
      });
    })
  ]
};
export {
  tailwind_config_default as default
};
