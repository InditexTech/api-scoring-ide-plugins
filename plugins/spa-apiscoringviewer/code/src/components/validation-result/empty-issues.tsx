// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { IconCircleCheck } from "@tabler/icons";
import Feedback from "components/feedback";

export default function EmptyIssues() {
  return (
    <Feedback
      data-testid="EmptyIssues"
      mainText="Congrats!"
      secondaryText="There are no issues"
      Icon={IconCircleCheck}
    />
  );
}
