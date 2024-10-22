// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ScoreLabel from "../../components/score-label";
import { FormattedMessage } from "react-intl";
import { Accordion, Flex, Text } from "@mantine/core";
import type { ReactNode } from "react";
import type { BaseValidation, ValidationType } from "../../../types";

type AccordionControlProps = {
  score: BaseValidation["score"];
  validationType: ValidationType;
  action: ReactNode;
};
export function AccordionControl({
  score,
  validationType,
  action,
}: Readonly<AccordionControlProps>) {
  return (
    <Flex align="center">
      <Accordion.Control>
        <Flex gap="sm" align="center">
          {score && (
            <ScoreLabel
              score={score}
              data-testid={`ScoreLabel-${validationType}`}
            />
          )}

          <Text
            ff="sans-serif"
            fz="sm"
            fw="bold"
            data-testid={`AccordionControlTitle-${validationType}`}
          >
            <FormattedMessage id={`api.validation.${validationType}`} />
          </Text>
        </Flex>
      </Accordion.Control>

      {action}
    </Flex>
  );
}
