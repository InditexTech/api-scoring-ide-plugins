// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { DEFAULT_THEME, type MantineThemeOverride } from "@mantine/core";

const vsCodeTheme = getVSCodeThemeValues();

export const theme = {
  colorScheme: "dark",
  colors: {
    ...DEFAULT_THEME.colors,
    dark: ["#C1C2C5", "#A6A7AB", "#909296", "#5c5f66", "#363331", "#2C2E33", "#25262b", "#1B1A18", "#141517", "#101113"],
    scoring: ["#39ac99", "#2d8677", "#b0c144", "#d78c42", "#e0525e"],
    water: ["#e7f1f8", "#9cc5e2", "#4d96cb", "#398bc6", "#347db2", "#1a9fff"],
  },
  fontSizes: { ...DEFAULT_THEME.fontSizes, ...(vsCodeTheme && { md: String(vsCodeTheme.fontSize) }) },
  defaultRadius: 0,
  ...(vsCodeTheme && { fontFamily: vsCodeTheme.fontFamily }),
} satisfies MantineThemeOverride;

function getVSCodeThemeValues() {
  const html = document.querySelector("html");
  if (!html) {
    return null;
  }

  const styles = getComputedStyle(html);

  return {
    fontSize: parseInt(styles.getPropertyValue("--vscode-font-size"), 10),
    fontFamily: styles.getPropertyValue("--vscode-font-family"),
  };
}
