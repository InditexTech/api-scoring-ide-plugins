// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type { MantineTheme } from "@mantine/core";

export function getLabelColor(theme: MantineTheme, score: number) {
  if (score >= 90) {
    return theme.colors.dark[9];
  }
  if (score >= 50) {
    return theme.colors.orange[6];
  }
  return theme.colors.red[4];
}
