// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { Center, Stack, Text } from "@mantine/core";
import { IconCircleX, IconInfoCircle } from "@tabler/icons";
import type { TablerIcon } from "@tabler/icons";
import type { CommonProps } from "types";

type FeedbackProps = {
  fullHeight?: boolean;
  mainText: ReactNode;
  secondaryText?: ReactNode;
  Icon: TablerIcon;
} & CommonProps;

export default function Feedback({
  fullHeight = false,
  mainText,
  secondaryText,
  Icon = IconInfoCircle,
  "data-testid": dataTestId = "ScoreLabel",
}: FeedbackProps) {
  const iconProps: ComponentPropsWithoutRef<TablerIcon> = { size: 80 };
  const style = { width: "100%", ...(fullHeight && { height: "100vh" }) };

  return (
    <Center style={style} data-testid={dataTestId}>
      <Stack align="center">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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

Feedback.Error = function FeedbackError({ ...props }: Omit<FeedbackProps, "Icon">) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Feedback {...props} Icon={IconCircleX} />;
};
