// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

// Prettier configuration
// https://prettier.io/docs/en/options.html
module.exports = {
  // 120 character long lines
  printWidth: 120,
  // Force trailling commas in array/object/function params last element
  trailingComma: "all",
  // Always use double quote, never single quote
  singleQuote: false,

  importOrder: [
    "^react.*",
    "^@mantine/(.*)$",
    "^@tabler/(.*)$",
    "^utils/(.*)$",
    "^hooks/(.*)$",
    "^api(.*)$",
    "^components/(.*)$",
    "^modules/(.*)$",
    "^[./]",
  ],
  importOrderSortSpecifiers: true,
  importOrderTypeImportsToBottom: true,
  importOrderBuiltinModulesToTop: true,
  importOrderSortIndividualImports: true,
};
