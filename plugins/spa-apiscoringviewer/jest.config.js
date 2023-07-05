/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["development"],
  },
  testMatch: ["**/*.test.{ts,tsx}"],
  // transformIgnorePatterns: [
  //   "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
  //   "mocks",
  // ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "<rootDir>/jest-setup.ts",
  ],
};
