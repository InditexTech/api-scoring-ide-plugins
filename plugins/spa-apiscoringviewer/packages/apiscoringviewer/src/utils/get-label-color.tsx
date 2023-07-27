// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type { MantineTheme } from "@mantine/core";

const RATINGS = ["A+", "A", "B", "C", "D"];

export function getLabelColor(theme: MantineTheme, scoreLabel: string) {
  return theme.colors.scoring[RATINGS.indexOf(scoreLabel)];
}
