// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import React from "react";
import CodeValidation from "components/validation-result/code-validation";

test("renders EmptyIssues component if not data", () => {
  render(<CodeValidation basePath="" spectralIssues={[]} protoIssues={[]} />);

  expect(screen.getByTestId("EmptyIssues")).toBeInTheDocument();
});
