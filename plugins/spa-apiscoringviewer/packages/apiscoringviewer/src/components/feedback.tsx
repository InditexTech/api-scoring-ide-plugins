// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { Center, Stack, Text } from "@mantine/core";
import { IconCircleX, IconInfoCircle } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import type { CommonProps } from "../types";

type FeedbackProps = {
  fullHeight?: boolean;
  mainText: ReactNode;
  secondaryText?: ReactNode;
  Icon: Icon;
} & CommonProps;

export default function Feedback({
  fullHeight = false,
  mainText,
  secondaryText,
  Icon = IconInfoCircle,
  "data-testid": dataTestId = "ScoreLabel",
}: Readonly<FeedbackProps>) {
  const iconProps: ComponentPropsWithoutRef<Icon> = { size: 80 };
  const style = { width: "100%", ...(fullHeight && { height: "100vh" }) };

  return (
    <Center style={style} data-testid={dataTestId}>
      <Stack align="center">
        {Icon && <Icon {...iconProps} />}

        <Stack spacing={0}>
          <Text fz="md" align="center">
            {mainText}
          </Text>

          {secondaryText && <Text c="dimmed">{secondaryText}</Text>}
        </Stack>
      </Stack>
    </Center>
  );
}

Feedback.Error = function FeedbackError({
  ...props
}: Omit<FeedbackProps, "Icon">) {
  return <Feedback {...props} Icon={IconCircleX} />;
};
