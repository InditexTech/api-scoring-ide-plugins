// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { FormattedMessage } from "react-intl";
import { Accordion, Flex, Text } from "@mantine/core";
import type { ReactNode } from "react";
import type { BaseValidation, Rating, ScoreFormat, ValidationType } from "../../../types";
import RatingScoreLabel from "../score-label/rating-score-label";
import PercentageScoreLabel from "../../components/score-label";

type AccordionControlProps = {
  rating: Rating;
  score: BaseValidation["score"];
  scoreFormat: ScoreFormat;
  validationType: ValidationType;
  action: ReactNode;
};

export function AccordionControl({ rating, score, scoreFormat, validationType, action }: Readonly<AccordionControlProps>) {
  return (
    <Flex align="center">
      <Accordion.Control>
        <Flex gap="sm" align="center">
          {scoreFormat === "rating" && rating && <RatingScoreLabel rating={rating} data-testid={`ScoreLabel-${validationType}`} />}

          {scoreFormat === "percentage" && typeof score === "number" && (
            <PercentageScoreLabel score={score} data-testid={`ScoreLabel-${validationType}`} />
          )}

          <Text ff="sans-serif" fz="sm" fw="bold" data-testid={`AccordionControlTitle-${validationType}`}>
            <FormattedMessage id={`api.validation.${validationType}`} />
          </Text>
        </Flex>
      </Accordion.Control>

      {action}
    </Flex>
  );
}
