// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from "react";
import { MantineTheme, Text, TextProps, packSx } from "@mantine/core";

export function CodeText({ sx, ...rest }: TextProps) {
  const getFontFamily = useCallback(
    (theme: MantineTheme) => ({ fontFamily: theme.fontFamilyMonospace ?? "sans-serif" }),
    [],
  );

  return <Text {...rest} span sx={[...packSx(sx), ...packSx(getFontFamily)]} />;
}
