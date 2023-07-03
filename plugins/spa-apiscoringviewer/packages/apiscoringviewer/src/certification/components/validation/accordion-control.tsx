import ScoreLabel from "../../components/score-label";
import { FormattedMessage } from "react-intl";
import { Accordion, Flex, Text } from "@mantine/core";
import type { ReactNode } from "react";
import type { Rating, ValidationType } from "../../../types";

type AccordionControlProps = {
  rating: Rating;
  validationType: ValidationType;
  action: ReactNode;
};
export function AccordionControl({ rating, validationType, action }: AccordionControlProps) {
  return (
    <Flex align="center">
      <Accordion.Control>
        <Flex gap="sm" align="center">
          {rating && <ScoreLabel rating={rating} data-testid={`ScoreLabel-${validationType}`} />}

          <Text ff="sans-serif" fz="sm" fw="bold" data-testid={`AccordionControlTitle-${validationType}`}>
            <FormattedMessage id={`api.validation.${validationType}`} />
          </Text>
        </Flex>
      </Accordion.Control>

      {action}
    </Flex>
  );
}
