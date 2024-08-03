/** 
 * @reference - https://github.com/withastro/prettier-plugin-astro/issues/97#issuecomment-1013645333 
 **/
module.exports ={
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "jsxBracketSameLine": true,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "pluginSearchDirs": ["."],
  "plugins": [require.resolve('prettier-plugin-astro')],
}
