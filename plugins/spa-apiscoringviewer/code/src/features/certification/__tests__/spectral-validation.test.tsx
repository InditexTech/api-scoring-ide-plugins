import { render, screen } from "@testing-library/react";
import React from "react";
import { Providers } from "utils/test-utils";
import SpectralValidation from "components/validation-result/spectral-validation";
import type { CodeIssue } from "types";

const API_PORTAL_OPEN_API_SOURCE = "apis/example/v3/openapi-rest.yml";
const API_PORTAL_OPEN_API_FILENAME = "hub/v3/openapi-rest.yml";
const CAMEL_CASE_FOR_PROPERTIES_CODE = "camel-case-for-properties";
const CAMEL_CASE_FOR_PROPERTIES_MESSAGE = "Property name has to be camelCase";

test("renders unlocated sources", async () => {
  render(<SpectralValidation basePath="" issues={createIssues()} />, { wrapper: Providers });

  expect(screen.getByTestId("ListGrouper-label").textContent).toBe("Unlocated issue");
});

function createIssues(source?: string): CodeIssue[] {
  return [
    {
      code: "first-pass",
      message: "message app",
      path: ["components", "schemas", "ApiVersionDTO", "properties", "definitionURL"],
      severity: 1,
      source,
      range: {
        start: {
          line: 4527,
          character: 22,
        },
        end: {
          line: 4532,
          character: 58,
        },
      },
      fileName: API_PORTAL_OPEN_API_FILENAME,
    },
    {
      code: CAMEL_CASE_FOR_PROPERTIES_CODE,
      message: CAMEL_CASE_FOR_PROPERTIES_MESSAGE,
      path: ["components", "schemas", "ApiVersionDTO", "properties", "artifactURL"],
      severity: 1,
      source,
      range: {
        start: {
          line: 4533,
          character: 20,
        },
        end: {
          line: 4538,
          character: 56,
        },
      },
      fileName: API_PORTAL_OPEN_API_FILENAME,
    },
    {
      code: CAMEL_CASE_FOR_PROPERTIES_CODE,
      message: CAMEL_CASE_FOR_PROPERTIES_MESSAGE,
      path: ["components", "schemas", "FullVersionDTO", "properties", "definitionURL"],
      severity: 1,
      source,
      range: {
        start: {
          line: 4611,
          character: 22,
        },
        end: {
          line: 4616,
          character: 26,
        },
      },
      fileName: API_PORTAL_OPEN_API_FILENAME,
    },
  ];
}
