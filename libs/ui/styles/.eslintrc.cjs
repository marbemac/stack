module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', '@marbemac/eslint-config'],
  settings: {
    tailwindcss: {
      callees: ['tw'],
      classRegex: '^tw$',
      config: `${__dirname}/tailwind.config.js`,
    },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
