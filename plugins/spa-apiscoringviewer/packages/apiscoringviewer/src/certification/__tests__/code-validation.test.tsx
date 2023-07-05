import { render, screen } from "@testing-library/react";
import CodeValidation from "../../components/validation-result/code-validation";

test("renders EmptyIssues component if not data", () => {
  render(<CodeValidation basePath="" spectralIssues={[]} protoIssues={[]} />);

  expect(screen.getByTestId("EmptyIssues")).toBeInTheDocument();
});
