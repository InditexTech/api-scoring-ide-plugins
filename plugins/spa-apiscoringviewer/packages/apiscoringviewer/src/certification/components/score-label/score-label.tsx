// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Text } from "@mantine/core";
import { getLabelColor } from "../../../utils/get-label-color";
import type { CommonProps } from "../../../types";

export const SCORE_LABEL_SMALL = "small";
export const SCORE_LABEL_LARGE = "large";

export type SizeType = typeof SCORE_LABEL_SMALL | typeof SCORE_LABEL_LARGE;

type ScoreLabelProps = {
  rating: string;
  size?: SizeType;
} & CommonProps;

export default function ScoreLabel({
  rating: scoreLabel,
  size = SCORE_LABEL_SMALL,
  "data-testid": dataTestId = "ScoreLabel",
}: ScoreLabelProps) {
  return (
    <Box
      data-testid={dataTestId}
      sx={(theme) => ({
        color: getLabelColor(theme, scoreLabel),
        fontWeight: 500,
        lineHeight: "16px",
        letterSpacing: ".5px",
        fontSize: "1rem",
        ...(size === SCORE_LABEL_LARGE
          ? {
              width: 64,
              height: 48,
              minWidth: 64,
            }
          : {
              width: 52,
              height: 40,
              minWidth: 52,
            }),
      })}
    >
      <Box
        sx={() => ({
          position: "relative",
          backgroundColor: "currentColor",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(size === SCORE_LABEL_LARGE
            ? {
                width: 48,
                height: 48,
              }
            : {
                width: 40,
                height: 40,
              }),

          "&::after": {
            content: '""',
            position: "absolute",
            width: "0",
            height: "0",
            left: "100%",
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: "inherit",
            borderStyle: "solid none solid solid",
            ...(size === SCORE_LABEL_LARGE
              ? {
                  borderWidth: "24px 0 24px 16px",
                }
              : {
                  borderWidth: "20px 0 20px 14px",
                }),
          },
        })}
      >
        <Text sx={{ color: "#fff" }} inline tt="uppercase" pl={size === SCORE_LABEL_LARGE ? 6 : 4}>
          {scoreLabel}
        </Text>
      </Box>
    </Box>
  );
}
