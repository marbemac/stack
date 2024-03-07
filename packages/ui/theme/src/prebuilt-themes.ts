import type { Theme } from './types.ts';

export type PrebuiltThemeIds =
  | 'default'
  | 'default_dark'
  | 'dracula'
  | 'duotone_light'
  | 'duotone_dark'
  | 'black'
  | 'material'
  | 'monokai'
  | 'night_owl'
  | 'nord'
  | 'one_light'
  | 'one_dark'
  | 'solarized_light'
  | 'solarized_dark'
  | 'vscode'
  | 'winter_light'
  | 'winter_dark'
  | 'funky';

export type PrebuiltThemes = Record<PrebuiltThemeIds, Theme>;

const defaultLightColors: Theme['colors'] = {
  text: '#121826',
  background: '#FFF',
  primary: '#1AABFF',
  danger: '#f05151',
  // secondary: '#121826',
  // muted: '#94abcc',
  // success: '#05b870',
  // warning: '#f46d2a',
};

const defaultDarkColors: Theme['colors'] = {
  text: '#eee4f6',
  background: '#18141f',
  primary: '#9166cc',
  danger: 'hsl(0, 65%, 60%)',
  // secondary: '#1aabff',
  // muted: 'hsl(274, 60%, 80%)',
  // success: 'hsl(156, 60%, 35%)',
  // warning: 'hsl(20, 60%, 52%)',
};

export const PREBUILT_THEMES: PrebuiltThemes = {
  default: {
    name: 'Default Light',
    colors: { ...defaultLightColors },
  },
  default_dark: {
    name: 'Default Dark',
    isDark: true,
    colors: { ...defaultDarkColors },
  },
  dracula: {
    name: 'Dracula',
    isDark: true,
    colors: {
      text: '#f8f8f2',
      background: '#272935',
      primary: '#ff79c6',
      danger: 'hsl(0, 100%, 67%)',
      // secondary: '#50fa7b', // TODO
      // muted: '#353842',
      // success: 'hsl(135, 94%, 65%)',
      // warning: 'hsl(31, 100%, 71%)',
    },
  },
  duotone_light: {
    name: 'Duotone Light',
    colors: {
      text: '#2d1f03',
      background: '#faf8f5',
      primary: '#8a681c',
      danger: 'hsl(0, 84%, 63%)',
      // secondary: '#8c6b20', // TODO
      // muted: '#e1ddd3',
      // success: 'hsl(156, 95%, 37%)',
      // warning: 'hsl(20, 90%, 56%)',
    },
  },
  duotone_dark: {
    name: 'Duotone Dark',
    isDark: true,
    colors: {
      text: '#d4d0e8',
      background: '#2a2734',
      primary: '#ffcc99',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#9a86fd', // TODO
      // muted: '#373440',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  black: {
    name: 'Black',
    isDark: true,
    colors: {
      text: '#fff',
      background: '#000',
      primary: '#2F6EEB',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#FFCB6B', // TODO
      // muted: '#333e45',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  material: {
    name: 'Material',
    isDark: true,
    colors: {
      text: '#E9EDED',
      background: '#263238',
      primary: '#C792EA',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#FFCB6B', // TODO
      // muted: '#333e45',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  monokai: {
    name: 'Monokai',
    isDark: true,
    colors: {
      text: '#f8f8f2',
      background: '#272822',
      primary: '#f92672',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#a6e22e', // TODO
      // muted: '#333330',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  night_owl: {
    name: 'Night Owl',
    isDark: true,
    colors: {
      text: '#c8cfdc',
      background: '#011627',
      primary: '#c792ea',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#F78C6C', // TODO
      // muted: '#03243e',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  nord: {
    name: 'Nord',
    isDark: true,
    colors: {
      text: '#d8dee9',
      background: '#2F343F',
      primary: '#81A1C1',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#8FBCBB', // TODO
      // muted: '#3c414b',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  one_light: {
    name: 'One Light',
    colors: {
      text: '#383a42',
      background: '#FAFAFA',
      primary: '#a626a4',
      danger: 'hsl(0, 84%, 63%)',
      // secondary: '#d19a66', // TODO
      // muted: '#dbdbdc',
      // success: 'hsl(156, 95%, 37%)',
      // warning: 'hsl(20, 90%, 56%)',
    },
  },
  one_dark: {
    name: 'One Dark',
    isDark: true,
    colors: {
      text: '#cad3e5',
      background: '#282c34',
      primary: '#c678dd',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#d19a66', // TODO
      // muted: '#363940',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  solarized_light: {
    name: 'Solarized Light',
    colors: {
      text: '#073642',
      background: '#fdf6e3',
      primary: '#cb4b16',
      danger: 'hsl(0, 84%, 63%)',
      // secondary: '#2aa198', // TODO
      // muted: '#eee8d5',
      // success: 'hsl(156, 95%, 37%)',
      // warning: 'hsl(20, 90%, 56%)',
    },
  },
  solarized_dark: {
    name: 'Solarized Dark',
    isDark: true,
    colors: {
      text: '#9fb2b5',
      background: '#002b36',
      primary: '#cb4b16',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#2aa198', // TODO
      // muted: '#013e4e',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  vscode: {
    name: 'VSCode',
    isDark: true,
    colors: {
      text: '#D4D4D4',
      background: '#1E1E1E',
      primary: '#C586C0',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#d19a66', // TODO
      // muted: '#2b2b2b',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  winter_light: {
    name: 'Winter Light',
    colors: {
      text: '#012339',
      background: '#fff',
      primary: '#236ebf',
      danger: 'hsl(0, 84%, 63%)',
      // secondary: '#a44185', // TODO
      // muted: '#e0ecf1',
      // success: 'hsl(156, 95%, 37%)',
      // warning: 'hsl(20, 90%, 56%)',
    },
  },
  winter_dark: {
    name: 'Winter Dark',
    isDark: true,
    colors: {
      text: '#d5deeb',
      background: '#001627',
      primary: '#00bff8',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#c792eb', // TODO
      // muted: '#02243f',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
  funky: {
    name: 'Funky',
    isDark: true,
    colors: {
      text: '#fff',
      background: '#6638f0',
      primary: '#fff',
      danger: 'hsl(0, 65%, 60%)',
      // secondary: '#F174FB', // TODO
      // muted: '#02243f',
      // success: 'hsl(156, 60%, 35%)',
      // warning: 'hsl(20, 60%, 52%)',
    },
  },
};
