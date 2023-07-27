// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { render, screen } from "@testing-library/react";
import CodeValidation from "../../components/validation-result/code-validation";

test("renders EmptyIssues component if not data", () => {
  render(<CodeValidation basePath="" spectralIssues={[]} protoIssues={[]} />);

  expect(screen.getByTestId("EmptyIssues")).toBeInTheDocument();
});
