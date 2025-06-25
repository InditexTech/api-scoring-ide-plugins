// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0
import { FormattedMessage } from "react-intl";
import { Flex, Badge, Box, Text, MantineTheme } from "@mantine/core";
import { getScoreLabelColor } from "../../../utils/get-label-color";
import type { CommonProps } from "../../../types";

type ScoreLabelProps = {
  score: number;
} & CommonProps;

export default function PercentageScoreLabel({ score, "data-testid": dataTestId = "ScoreLabel" }: Readonly<ScoreLabelProps>) {
  return (
    <Badge variant="filled" color="dark.2" radius={0} data-testid={dataTestId}>
      <Flex align="center" gap="xs">
        <ScoreSquare score={score} />
        <FormattedMessage id="certification.score.label" values={{ score }} />
      </Flex>
    </Badge>
  );
}

function ScoreSquare({ score }: Readonly<{ score: number }>) {
  return (
    <Box
      sx={(theme) => ({
        display: "inline-block",
        width: 8,
        height: 8,
        backgroundColor: getScoreLabelColor(theme, score),
      })}
    />
  );
}
