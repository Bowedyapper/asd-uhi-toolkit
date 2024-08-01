module.exports = {
  parserOptions: {
    extraFileExtensions: ['.svelte']
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    'no-undef': 'off', //Disabled as Typescript enforces this rule https://eslint.org/docs/latest/rules/no-undef#handled_by_typescript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ]
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ]
};
