import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { CertificationPage, isVsCode } from "@inditextech/apiscoringviewer";
import {
  API_VALIDATION_RESULTS,
  CERTS_PAYLOAD,
  MODULE_RESULTS,
  Providers,
} from "../../apiscoringviewer/src/utils/test-utils";
import VSCodeDataProvider from "../src/components/vscode-data-provider";

jest.mock("@inditextech/apiscoringviewer", () => ({
  ...jest.requireActual("@inditextech/apiscoringviewer"),
  isVsCode: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
jest.mock(
  "react-virtualized-auto-sizer",
  () =>
    ({ children }: { children: ({}) => ReactNode }) =>
      children({ width: "100%", height: "100%" })
);

const isVsCodeMock = jest.mocked(isVsCode);

window.cefQuery = jest.fn();
const postMessage = jest.fn();

// jest.spyOn(window, "getComputedStyle").mockImplementation(elt => )

beforeAll(() => {
  Object.defineProperty(global.window, "parent", {
    value: {
      postMessage,
    },
    writable: true,
  });
});

afterEach(() => {
  postMessage.mockClear();
});

describe("renders inside IDE", () => {
  beforeEach(() => {
    isVsCodeMock.mockReturnValue(true);
    postMessage.mockReset();
  });

  test("renders certification", async () => {
    act(() => {
      render(<CertificationPage DataProvider={VSCodeDataProvider} />, {
        wrapper: Providers,
      });
    });

    const certificationResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setCertificationResults", payload: CERTS_PAYLOAD },
    });

    await act(async () => {
      window.dispatchEvent(certificationResultsEvent);
    });

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "API Sample"
    );
    expect(screen.getByTestId("ApiTab-API Sample-1")).toBeInTheDocument();
    expect(screen.getByTestId("ApiTab-Other API-1")).toBeInTheDocument();

    await checkApiSampleContent();

    const currentTabContainer = within(
      screen.getByTestId("ApiValidation-API Sample-1")
    );

    postMessage.mockReset();

    const revalidateLinterButton = screen.getByTestId(
      "RevalidateButton-API Sample-1"
    );
    fireEvent.click(revalidateLinterButton);
    expect(postMessage).toHaveBeenCalled();
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      {
        command: "onClickValidateModule",
        payload: {
          apiDefinitionPath: "portal/v3",
          apiName: "API Sample",
          apiSpecType: 1,
          validationType: 1,
        },
      },
      "*"
    );

    // Run compile
    postMessage.mockReset();
    const lintListItem = screen.getByTestId(
      "Issue-apis/example/v3/openapi-rest.yml-first-pass-lint-error-4527-22-4532-58-0"
    );
    fireEvent.click(lintListItem);
    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickOpenFile",
        payload: {
          fileName:
            "/some/user/p/app-apiposvc/apis/portal/v3/apis/example/v3/openapi-rest.yml",
          infoPosition: { char: 22, lastLine: 4532, lastchar: 58, line: 4527 },
        },
      },
      "*"
    );

    // Revalidate the module
    const moduleResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setModuleResults", payload: MODULE_RESULTS },
    });

    await act(async () => {
      window.dispatchEvent(moduleResultsEvent);
    });

    // screen.debug();
    // Overall rating info is no longer rendered
    expect(
      screen.queryByTestId("ApiHeading-Score-API Sample-1")
    ).not.toBeInTheDocument();

    // New errors are displayed
    expect(
      currentTabContainer.getByText("new-lint-error-on-revalidation")
    ).toBeInTheDocument();
    expect(
      currentTabContainer.getByText("New lint error while revalidating")
    ).toBeInTheDocument();

    // Check that apiDefinitionPath was updated from the one in MODULE_RESULTS
    postMessage.mockReset();
    const lintListItem2 = screen.getByTestId(
      "Issue-apis/example/v3/openapi-rest.yml-new-lint-error-on-revalidation-3755-22-3760-26-0"
    );
    fireEvent.click(lintListItem2);
    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickOpenFile",
        payload: {
          fileName:
            "/some/user/p/app-apiposvc/apis/different/apis/route/portal/v3/apis/example/v3/openapi-rest.yml",
          infoPosition: { char: 22, lastLine: 3760, lastchar: 26, line: 3755 },
        },
      },
      "*"
    );

    // When the tab is changed the content is reload accondingly
    const secondTab = screen.getByRole("tab", { selected: false });
    expect(secondTab).toHaveTextContent("Other API");
    fireEvent.click(secondTab);

    const secondTabContainer = within(
      screen.getByTestId("ApiValidation-Other API-1")
    );

    // When the errored tab is not selected, then is when the error icon is shown.
    // expect(apiPortalTab.getElementsByClassName("icoErrorTab")).toHaveLength(1);
    expect(
      secondTabContainer.getByText("js-properties-should-be-camel-case")
    ).toBeInTheDocument();

    postMessage.mockReset();
    const docListItem = screen.getByTestId(
      "Issue-MIGRATION.md-13-MD009-no-trailing-spaces"
    );
    fireEvent.click(docListItem);

    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickOpenFile",
        payload: {
          fileName: "/some/user/p/app-apiposvc/apis/MIGRATION.md",
          infoPosition: {
            char: 14,
            lastLine: undefined,
            lastchar: undefined,
            line: 13,
          },
        },
      },
      "*"
    );
  });

  test("api validation results are updated", async () => {
    act(() => {
      render(<CertificationPage DataProvider={VSCodeDataProvider} />, {
        wrapper: Providers,
      });
    });

    const certificationResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setCertificationResults", payload: CERTS_PAYLOAD },
    });

    act(() => {
      window.dispatchEvent(certificationResultsEvent);
    });

    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onProjectLoaded",
        payload: {},
      },
      "*"
    );

    postMessage.mockReset();

    const revalidateApiButton = screen.getByTestId(
      "RevalidateApiButton-API Sample"
    );
    await userEvent.click(revalidateApiButton);

    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickValidateModule",
        payload: {
          apiDefinitionPath: "portal/v3",
          apiName: "API Sample",
          apiSpecType: 1,
          validationType: 4,
        },
      },
      "*"
    );

    expect(revalidateApiButton).toHaveAttribute("data-loading", "true");

    const apiResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setModuleResults", payload: API_VALIDATION_RESULTS },
    });

    act(() => {
      window.dispatchEvent(apiResultsEvent);
    });

    expect(
      screen.getByText(/You have to fix some errors to improve/i)
    ).toBeInTheDocument();

    // New errors are displayed
    const tabContainer = within(
      await screen.findByTestId("ApiValidation-API Sample-1")
    );
    const designValidationResult =
      tabContainer.getByTestId("ValidationResult-1");
    expect(
      within(designValidationResult).getByText("new-lint-error-on-revalidation")
    ).toBeInTheDocument();
    expect(
      within(designValidationResult).getByText(
        "New lint error while revalidating"
      )
    ).toBeInTheDocument();

    const securityValidationResult =
      tabContainer.getByTestId("ValidationResult-3");
    expect(
      within(securityValidationResult).getByTestId(
        "ProtoValidation-grpc/example/v1/adjustment.proto-array-required-properties-33-3-0"
      )
    ).toBeInTheDocument();

    const documentationValidationResult =
      tabContainer.getByTestId("ValidationResult-2");
    expect(
      within(documentationValidationResult).getByTestId(
        "Issue-README.md-13-MD034-no-bare-urls"
      )
    ).toBeInTheDocument();
  });

  test("revalidation module error is displayed and reseted", async () => {
    act(() => {
      render(<CertificationPage DataProvider={VSCodeDataProvider} />, {
        wrapper: Providers,
      });
    });

    const certificationResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setCertificationResults", payload: CERTS_PAYLOAD },
    });

    act(() => {
      window.dispatchEvent(certificationResultsEvent);
    });

    const runLintingButton = screen.getByTestId(
      "RevalidateButton-API Sample-1"
    );
    await userEvent.click(runLintingButton);

    expect(runLintingButton).toHaveAttribute("data-loading", "true");

    const extensionErrorEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: {
        command: "throwExtensionError",
        payload: { name: "Some error", message: "Something wrong happened!" },
      },
    });

    act(() => {
      window.dispatchEvent(extensionErrorEvent);
    });

    expect(
      screen.queryByTestId("CertificationPage-NetworkError")
    ).toBeInTheDocument();
    expect(runLintingButton).not.toHaveAttribute("data-loading", "true");
  });
});

async function checkApiSampleContent() {
  const tabContainer = within(
    await screen.findByTestId("ApiValidation-API Sample-1")
  );

  expect(screen.getByTestId("ApiHeading-Badge-API Sample-1")).toHaveTextContent(
    "REST"
  );
  expect(screen.getByTestId("ApiHeading-Score-API Sample-1")).toHaveTextContent(
    "D"
  );

  expect(
    tabContainer.getByTestId("AccordionControlTitle-1")
  ).toBeInTheDocument();
  expect(
    tabContainer.getByTestId("AccordionControlTitle-3")
  ).toBeInTheDocument();
  expect(
    tabContainer.getByTestId("AccordionControlTitle-2")
  ).toBeInTheDocument();

  expect(tabContainer.getByTestId("ScoreLabel-1")).toHaveTextContent("C");
  expect(tabContainer.getByTestId("ScoreLabel-3")).toHaveTextContent("A+");
  expect(tabContainer.getByTestId("ScoreLabel-2")).toHaveTextContent("A");

  const designValidationResult = tabContainer.getByTestId("ValidationResult-1");
  expect(
    within(designValidationResult).getByText("This error is only on first pass")
  ).toBeInTheDocument();
  expect(
    within(designValidationResult).getByText(
      "Property name has to be camelCase"
    )
  ).toBeInTheDocument();

  const securityValidationResult =
    tabContainer.getByTestId("ValidationResult-3");
  expect(
    within(securityValidationResult).getByText(
      "Global 'security' field is not defined"
    )
  ).toBeInTheDocument();
  expect(
    within(securityValidationResult).getByText(
      "Server objects should support https"
    )
  ).toBeInTheDocument();
  expect(
    within(securityValidationResult).getByText(
      '"schema.format" property must be defined'
    )
  ).toBeInTheDocument();

  const documentationValidationResult =
    tabContainer.getByTestId("ValidationResult-2");
  expect(
    within(documentationValidationResult).getByText("Bare URL used")
  ).toBeInTheDocument();
}
