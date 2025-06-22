/**
 * @reference - https://github.com/withastro/prettier-plugin-astro/issues/97#issuecomment-1013645333
 * This config is required for the script to work from package.json to resolve 'prettier-plugin-astro'
 **/
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-organize-imports'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
}
