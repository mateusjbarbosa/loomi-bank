module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 100 }],
    'no-multiple-empty-lines': ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
