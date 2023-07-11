import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import messages from "../locales";
import {
  type CertificationPayload,
  type ModulePayload,
  ProtocolType,
  Severity,
  ValidationType,
} from "../types";

export function Providers({ children }: { children?: ReactNode }) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <IntlProvider locale="en" messages={messages.en}>
        {children}
      </IntlProvider>
    </MantineProvider>
  );
}

export function createJSONFile() {
  const filename = "file.json";
  const file = new File(["{}"], filename, { type: "application/json" });
  file.path = `/Users/inditex/path/to/${filename}`;
  return file;
}

const API_NAME_1 = "API Sample";
const API_NAME_2 = "Other API";
const API_SAMPLE_SOURCE = "apis/example/v3/openapi-rest.yml";
const API_SAMPLE_FILENAME = "hub/v3/openapi-rest.yml";
const CAMEL_CASE_FOR_PROPERTIES_CODE = "camel-case-for-properties";
const CAMEL_CASE_FOR_PROPERTIES_MESSAGE = "Property name has to be camelCase";

export const CERTS_PAYLOAD: CertificationPayload = {
  metadata: {
    apis: [
      {
        name: API_NAME_1,
        apiSpecType: "REST",
        definitionPath: "portal/v3",
      },
      {
        name: API_NAME_2,
        apiSpecType: "REST",
        definitionPath: "portal/operations",
      },
    ],
  },
  rootPath: "/some/user/p/app-apiposvc/apis",
  results: [
    {
      apiName: API_NAME_1,
      apiProtocol: "REST",
      result: [
        {
          designValidation: {
            validationType: "DESIGN",
            spectralValidation: {
              issues: [
                {
                  code: "first-pass-lint-error",
                  message: "This error is only on first pass",
                  path: [
                    "components",
                    "schemas",
                    "ApiVersionDTO",
                    "properties",
                    "definitionURL",
                  ],
                  severity: 1,
                  source: API_SAMPLE_SOURCE,
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
                  fileName: API_SAMPLE_FILENAME,
                },
                {
                  code: CAMEL_CASE_FOR_PROPERTIES_CODE,
                  message: CAMEL_CASE_FOR_PROPERTIES_MESSAGE,
                  path: [
                    "components",
                    "schemas",
                    "ApiVersionDTO",
                    "properties",
                    "artifactURL",
                  ],
                  severity: 1,
                  source: API_SAMPLE_SOURCE,
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
                  fileName: API_SAMPLE_FILENAME,
                },
                {
                  code: "ensure-properties-examples",
                  message: "branch doesn't have an example",
                  path: [
                    "components",
                    "schemas",
                    "ApiRepository",
                    "properties",
                    "branch",
                  ],
                  severity: 1,
                  source: "/apicollections/rest/openapi-rest.yml",
                  range: {
                    start: {
                      line: 208,
                      character: 15,
                    },
                    end: {
                      line: 210,
                      character: 23,
                    },
                  },
                  fileName: "/apicollections/rest/openapi-rest.yml",
                },
              ],
            },
            protolintValidation: {
              issues: [],
            },
            score: 35,
            rating: "C",
            ratingDescription: "Bad rating",
          },
        },
        {
          securityValidation: {
            validationType: "SECURITY",
            spectralValidation: {
              issues: [
                {
                  code: "global-security",
                  message: "Global 'security' field is not defined",
                  path: [],
                  severity: 0,
                  source: API_SAMPLE_SOURCE,
                  range: {
                    start: {
                      line: 0,
                      character: 0,
                    },
                    end: {
                      line: 316,
                      character: 23,
                    },
                  },
                  fileName: API_SAMPLE_FILENAME,
                },
                {
                  code: "server-https",
                  message: "Server objects should support https",
                  path: ["servers", "0", "url"],
                  severity: 1,
                  source: API_SAMPLE_SOURCE,
                  range: {
                    start: {
                      line: 9,
                      character: 9,
                    },
                    end: {
                      line: 9,
                      character: 13,
                    },
                  },
                  fileName: API_SAMPLE_FILENAME,
                },
                {
                  code: "numeric-required-properties-format",
                  message: '"schema.format" property must be defined',
                  path: [
                    "paths",
                    "/reports/notificationsList",
                    "get",
                    "parameters",
                    "0",
                    "schema",
                  ],
                  severity: 1,
                  source: API_SAMPLE_SOURCE,
                  range: {
                    start: {
                      line: 23,
                      character: 17,
                    },
                    end: {
                      line: 24,
                      character: 25,
                    },
                  },
                  fileName: API_SAMPLE_FILENAME,
                },
              ],
            },
            protolintValidation: {
              issues: [],
            },
            score: 100,
            rating: "A+",
            ratingDescription: "Excellent",
          },
        },
        {
          documentationValidation: {
            validationType: "DOCUMENTATION",
            issues: [
              {
                lineNumber: 7,
                ruleNames: ["MD034", "no-bare-urls"],
                ruleDescription: "Bare URL used",
                ruleInformation:
                  "https://github.com/DavidAnson/markdownlint/blob/v0.25.1/doc/Rules.md#md034",
                errorDetail: null,
                errorContext: "https://www.example.com/",
                errorRange: [27, 24],
                fileName: "apis/README.md",
              },
            ],
            score: 97.92,
            rating: "A",
            ratingDescription: "Very Good",
          },
        },
      ],
      score: 0,
      rating: "D",
      ratingDescription: "Inadequate",
    },
    {
      apiName: API_NAME_2,
      apiProtocol: "REST",
      result: [
        {
          designValidation: {
            validationType: "DESIGN",
            spectralValidation: {
              issues: [
                {
                  code: "js-properties-should-be-camel-case",
                  message: "JS Property name has to be camelCase",
                  path: [
                    "components",
                    "schemas",
                    "ArtifactDTO",
                    "properties",
                    "URL",
                  ],
                  severity: 1,
                  source: "apis/portal/operations/openapi-rest.yml",
                  range: {
                    start: {
                      line: 412,
                      character: 12,
                    },
                    end: {
                      line: 415,
                      character: 26,
                    },
                  },
                  fileName: "portal/operations/openapi-rest.yml",
                },
                {
                  code: CAMEL_CASE_FOR_PROPERTIES_CODE,
                  message: CAMEL_CASE_FOR_PROPERTIES_MESSAGE,
                  path: [
                    "components",
                    "schemas",
                    "ApiDTO",
                    "properties",
                    "definitionURL",
                  ],
                  severity: 1,
                  source: "apis/portal/operations/openapi-rest.yml",
                  range: {
                    start: {
                      line: 501,
                      character: 22,
                    },
                    end: {
                      line: 504,
                      character: 26,
                    },
                  },
                  fileName: "portal/operations/openapi-rest.yml",
                },
              ],
            },
            protolintValidation: {
              issues: [],
            },
            score: 95,
            rating: "A",
            ratingDescription: "Very Good",
          },
        },
        {
          securityValidation: {
            validationType: "SECURITY",
            spectralValidation: {
              issues: [],
            },
            protolintValidation: {
              issues: [
                {
                  line: 33,
                  column: 3,
                  message:
                    'EnumField name "ADJUSTMENT_UNSPECIFIED" should have the prefix "ADJUSTMENT_TYPE"',
                  rule: "ENUM_FIELD_NAMES_PREFIX",
                  fileName: "grpc/example/v1/adjustment.proto",
                  severity: 2,
                },
              ],
            },
            score: 83,
            rating: "B",
            ratingDescription: "Good",
          },
        },
        {
          documentationValidation: {
            validationType: "DOCUMENTATION",
            issues: [
              {
                lineNumber: 13,
                ruleNames: ["MD009", "no-trailing-spaces"],
                ruleDescription: "Trailing spaces",
                ruleInformation:
                  "https://github.com/DavidAnson/markdownlint/blob/v0.25.1/doc/Rules.md#md009",
                errorDetail: "Expected: 0 or 2; Actual: 1",
                errorContext: null,
                errorRange: [14, 1],
                fileName: "MIGRATION.md",
              },
            ],
            score: 92.2,
            rating: "A",
            ratingDescription: "Very Good",
          },
        },
      ],
      score: 0,
      rating: "C",
      ratingDescription: "Adequate",
    },
  ],
};

const lintRevalidationError1 = {
  code: "new-lint-error-on-revalidation",
  fileName: "openapi-rest.yml",
  message: "New lint error while revalidating",
  path: [
    "components",
    "schemas",
    "ApiVersionV2DTO",
    "properties",
    "definitionURL",
  ],
  severity: 1 as Severity,
  source: API_SAMPLE_SOURCE,
  range: {
    start: {
      line: 3755,
      character: 22,
    },
    end: {
      line: 3760,
      character: 26,
    },
  },
};

const lintRevalidationError2 = {
  code: "other-kind-of-error",
  fileName: "openapi-rest.yml",
  message: CAMEL_CASE_FOR_PROPERTIES_MESSAGE,
  path: [
    "components",
    "schemas",
    "ApiVersionV2DTO",
    "properties",
    "artifactURL",
  ],
  severity: 1 as Severity,
  source: API_SAMPLE_SOURCE,
  range: {
    start: {
      line: 3761,
      character: 20,
    },
    end: {
      line: 3766,
      character: 26,
    },
  },
};

export const API_VALIDATION_RESULTS: ModulePayload = {
  apiModule: {
    apiName: API_NAME_1,
    apiDefinitionPath: "different/apis/route/portal/v3",
    validationType: "OVERALL_SCORE",
    apiSpecType: "REST",
  },
  results: [
    {
      apiName: API_NAME_1,
      apiProtocol: "REST",
      rating: "C",
      ratingDescription: "You have to fix some errors to improve",
      score: 0,
      result: [
        {
          designValidation: {
            spectralValidation: {
              issues: [lintRevalidationError1, lintRevalidationError2],
            },
            rating: "A",
            ratingDescription: "Very Good",
            score: 95,
            validationType: "DESIGN",
          },
        },
        {
          securityValidation: {
            validationType: "SECURITY",
            spectralValidation: {
              issues: [],
            },
            protolintValidation: {
              issues: [
                {
                  line: 33,
                  column: 3,
                  message: "Schema of type array must specify maxItems",
                  rule: "array-required-properties",
                  fileName: "grpc/example/v1/adjustment.proto",
                  severity: 2,
                },
              ],
            },
            score: 63,
            rating: "C",
            ratingDescription: "So so",
          },
        },
        {
          documentationValidation: {
            validationType: "DOCUMENTATION",
            issues: [
              {
                lineNumber: 13,
                ruleNames: ["MD034", "no-bare-urls"],
                ruleDescription: "No bare urls",
                ruleInformation:
                  "https://github.com/DavidAnson/markdownlint/blob/v0.25.1/doc/Rules.md#md0123",
                errorDetail: "Expected: 0 or 2; Actual: 1",
                errorContext: null,
                errorRange: [14, 1],
                fileName: "README.md",
              },
            ],
            score: 82.2,
            rating: "B",
            ratingDescription: "Good",
          },
        },
      ],
    },
  ],
};

export const MODULE_RESULTS: ModulePayload = {
  apiModule: {
    ...API_VALIDATION_RESULTS.apiModule,
    validationType: "DESIGN",
  },
  results: [
    {
      ...API_VALIDATION_RESULTS.results[0],
      rating: "D",
      ratingDescription: "Inadequate",
      result: [API_VALIDATION_RESULTS.results[0].result[0]],
    },
  ],
};

export const VALIDATION_FILE_RESULT = {
  hasErrors: false,
  results: [
    {
      code: "global-doc",
      message:
        "Definition `doc` must be present and non-empty string in all types",
      path: [],
      severity: 1,
      source: "/temporal/path/to/file.yml",
      range: {
        start: {
          line: 0,
          character: 0,
        },
        end: {
          line: 6,
          character: 20,
        },
      },
    },
  ],
};

export class FileReaderMock {
  DONE = FileReader.DONE;
  EMPTY = FileReader.EMPTY;
  LOADING = FileReader.LOADING;
  readyState: 0 | 1 | 2 = 0;
  error: FileReader["error"] = null;
  result: FileReader["result"] = null;
  abort = jest.fn();
  addEventListener = jest.fn();
  dispatchEvent = jest.fn();
  onabort = jest.fn();
  onerror = jest.fn();
  onload = jest.fn();
  onloadend = jest.fn();
  onloadprogress = jest.fn();
  onloadstart = jest.fn();
  onprogress = jest.fn();
  readAsArrayBuffer = jest.fn();
  readAsBinaryString = jest.fn();
  readAsDataURL = () => {
    this.onloadend();
  };
  readAsText = jest.fn();
  removeEventListener = jest.fn();
}
