import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import React from "react";
import DocValidation from "components/validation-result/doc-validation";

test("renders EmptyIssues component if not data", () => {
  render(<DocValidation basePath="" issues={[]} />);

  expect(screen.getByTestId("EmptyIssues")).toBeInTheDocument();
});
