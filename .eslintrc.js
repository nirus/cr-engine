module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "no-loops"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
  ],
  // ...
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ["*.astro", "*.ts"],

      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
        "no-console": 2,
      },
    },
    // ...
  ],
};