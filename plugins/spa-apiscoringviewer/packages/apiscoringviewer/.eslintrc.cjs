/* eslint-env node */
module.exports = {
  ignorePatterns: [".parcel-cache", "dist", "node_modules"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["../../tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  root: true,
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useIsomorphicLayoutEffect)",
      },
    ],
  },
};
