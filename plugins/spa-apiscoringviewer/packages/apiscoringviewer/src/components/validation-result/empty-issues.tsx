// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { IconCircleCheck } from "@tabler/icons-react";
import Feedback from "../../components/feedback";

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
