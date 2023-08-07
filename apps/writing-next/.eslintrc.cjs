module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', '@marbemac/eslint-config/next'],

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },

  settings: {
    next: {
      rootDir: 'apps/writing-next',
    },
  },
};
