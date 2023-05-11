module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:sonarjs/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["./src/"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
      alias: {
        map: [
          ["@", "./src"],
          ["config", "./config"],
          ["resources", "./resources"],
          ["root", "."],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "react/prop-types": ["warn", { skipUndeclared: true }],
    "react/destructuring-assignment": "error",
    "react/jsx-props-no-spreading": "error",
    "react/function-component-definition": [2, { namedComponents: "function-declaration" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Issue errors if the "rules of hooks" are not met
    // https://reactjs.org/docs/hooks-rules.html
    "react-hooks/rules-of-hooks": "error",

    // Issue errors if hooks dependendencies are not exhaustive
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks: "(useAsync|useAsyncCallback)",
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", ".tsx"],
      rules: {
        "no-undef": "off",
      },
    },
    {
      files: ["*-test.js", "*-test.jsx", "*.test.ts", "*.test.tsx"],
      rules: {
        "sonarjs/no-duplicate-string": "off",
        "react/jsx-props-no-spreading": "off",
      },
      env: {
        jest: true,
      },
    },
  ],
};
