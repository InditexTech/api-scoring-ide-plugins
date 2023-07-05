import { render, screen } from "@testing-library/react";
import DocValidation from "../../components/validation-result/doc-validation";

test("renders EmptyIssues component if not data", () => {
  render(<DocValidation basePath="" issues={[]} />);

  expect(screen.getByTestId("EmptyIssues")).toBeInTheDocument();
});
