module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.astro'],
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'no-loops'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier',
  ],
  // ...
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro', '*.ts'],

      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        '@typescript-eslint/strict-boolean-expressions': [
          2,
          {
            allowString: false,
            allowNumber: false,
          },
        ],
        'no-console': 'off',
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
            message: 'Unexpected property on console object was called',
          },
        ],
      },
    },
    // ...
  ],
}
