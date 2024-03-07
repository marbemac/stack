import fs from 'fs/promises';

import type { PrebuiltThemeIds } from './src/index.ts';
import { cssPropsToString, generateTheme, PREBUILT_THEMES } from './src/index.ts';

for (const themeId in PREBUILT_THEMES) {
  const theme = generateTheme(themeId as PrebuiltThemeIds);

  const css = cssPropsToString(theme.css, true);

  await fs.writeFile(`./css/${themeId}.css`, css, 'utf-8');
}
