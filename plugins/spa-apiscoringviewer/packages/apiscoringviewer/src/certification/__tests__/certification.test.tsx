// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { vi, beforeAll, afterEach, beforeEach, describe, test, expect } from "vitest";
import { API_VALIDATION_RESULTS, CERTS_PAYLOAD, MODULE_RESULTS, Providers } from "../../utils/test-utils";
import IdeProvider from "../ide-data-provider";
import isVsCode from "../../utils/is-vscode";
import isIntelliJ from "../../utils/is-intellij";
import Certification from "../certification";

vi.mock("../../utils/is-vscode");
vi.mock("../../utils/is-intellij");
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
}));
vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({ children }: { children: ({}) => ReactNode }) => children({ width: "100%", height: "100%" }),
}));

const isVsCodeMock = vi.mocked(isVsCode);
const isIntelliJMock = vi.mocked(isIntelliJ);

window.cefQuery = vi.fn();
const postMessage = vi.fn();

beforeAll(() => {
  Object.defineProperty(global.window, "parent", {
    value: {
      postMessage,
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("renders inside VSCode IDE", () => {
  beforeEach(() => {
    isVsCodeMock.mockReturnValue(true);
    isIntelliJMock.mockReturnValue(false);
    postMessage.mockReset();
  });

  test("renders certification", async () => {
    render(<Certification DataProvider={IdeProvider} />, {
      wrapper: Providers,
    });

    const certificationResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setCertificationResults", payload: CERTS_PAYLOAD },
    });

    await act(async () => {
      window.dispatchEvent(certificationResultsEvent);
    });

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("API Sample");
    expect(screen.getByTestId("ApiTab-Other API-REST")).toHaveTextContent("Other API");

    await checkApiSampleContent();

    const currentTabContainer = within(screen.getByTestId("ApiValidation-API Sample-REST"));

    postMessage.mockReset();

    const revalidateLinterButton = screen.getByTestId("RevalidateButton-API Sample-DESIGN");
    await userEvent.click(revalidateLinterButton);

    expect(postMessage).toHaveBeenCalled();
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      {
        command: "onClickValidateModule",
        payload: {
          apiDefinitionPath: "portal/v3",
          apiName: "API Sample",
          apiSpecType: "REST",
          validationType: "DESIGN",
        },
      },
      "*",
    );

    // Run compile
    postMessage.mockReset();
    const lintListItem = screen.getByTestId("Issue-apis/example/v3/openapi-rest.yml-first-pass-lint-error-4527-22-4532-58-0");
    await userEvent.click(lintListItem);
    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickOpenFile",
        payload: {
          fileName: "/some/user/p/app-apiposvc/apis/portal/v3/apis/example/v3/openapi-rest.yml",
          infoPosition: { char: 22, lastLine: 4532, lastchar: 58, line: 4527 },
        },
      },
      "*",
    );

    // Revalidate the module
    const moduleResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setModuleResults", payload: MODULE_RESULTS },
    });

    await act(async () => {
      window.dispatchEvent(moduleResultsEvent);
    });

    // Overall rating info is no longer rendered
    expect(screen.queryByTestId("ApiHeading-Score-API Sample-1")).not.toBeInTheDocument();

    // New errors are displayed
    expect(currentTabContainer.getByText("new-lint-error-on-revalidation")).toBeInTheDocument();
    expect(currentTabContainer.getByText("New lint error while revalidating")).toBeInTheDocument();

    // Check that apiDefinitionPath was updated from the one in MODULE_RESULTS
    postMessage.mockReset();
    const lintListItem2 = screen.getByTestId("Issue-apis/example/v3/openapi-rest.yml-new-lint-error-on-revalidation-3755-22-3760-26-0");
    await userEvent.click(lintListItem2);
    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickOpenFile",
        payload: {
          fileName: "/some/user/p/app-apiposvc/apis/different/apis/route/portal/v3/apis/example/v3/openapi-rest.yml",
          infoPosition: { char: 22, lastLine: 3760, lastchar: 26, line: 3755 },
        },
      },
      "*",
    );

    // When the tab is changed the content is reload accondingly
    const secondTab = screen.getByRole("tab", { selected: false });
    expect(secondTab).toHaveTextContent("Other API");
    await userEvent.click(secondTab);

    const secondTabContainer = within(screen.getByTestId("ApiValidation-Other API-REST"));

    // When the errored tab is not selected, then is when the error icon is shown.
    // expect(apiPortalTab.getElementsByClassName("icoErrorTab")).toHaveLength(1);
    expect(secondTabContainer.getByText("js-properties-should-be-camel-case")).toBeInTheDocument();

    postMessage.mockReset();
    const docListItem = screen.getByTestId("Issue-MIGRATION.md-13-MD009-no-trailing-spaces");
    await userEvent.click(docListItem);

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
      "*",
    );
  });

  test("api validation results are updated", async () => {
    act(() => {
      render(<Certification DataProvider={IdeProvider} />, {
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
      "*",
    );

    postMessage.mockReset();

    const revalidateApiButton = screen.getByTestId("RevalidateApiButton-API Sample");
    await userEvent.click(revalidateApiButton);

    expect(postMessage).toBeCalled();
    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith(
      {
        command: "onClickValidateModule",
        payload: {
          apiDefinitionPath: "portal/v3",
          apiName: "API Sample",
          apiSpecType: "REST",
          validationType: "OVERALL_SCORE",
        },
      },
      "*",
    );

    expect(revalidateApiButton).toHaveAttribute("data-loading", "true");

    const apiResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setModuleResults", payload: API_VALIDATION_RESULTS },
    });

    act(() => {
      window.dispatchEvent(apiResultsEvent);
    });

    expect(screen.getByText(/You have to fix some errors to improve/i)).toBeInTheDocument();

    // New errors are displayed
    const tabContainer = within(await screen.findByTestId("ApiValidation-API Sample-REST"));
    const designValidationResult = tabContainer.getByTestId("ValidationResult-DESIGN");
    expect(within(designValidationResult).getByText("new-lint-error-on-revalidation")).toBeInTheDocument();
    expect(within(designValidationResult).getByText("New lint error while revalidating")).toBeInTheDocument();

    const securityValidationResult = tabContainer.getByTestId("ValidationResult-SECURITY");
    expect(
      within(securityValidationResult).getByTestId("ProtoValidation-grpc/example/v1/adjustment.proto-array-required-properties-33-3-0"),
    ).toBeInTheDocument();

    const documentationValidationResult = tabContainer.getByTestId("ValidationResult-DOCUMENTATION");
    expect(within(documentationValidationResult).getByTestId("Issue-README.md-13-MD034-no-bare-urls")).toBeInTheDocument();
  });

  test("revalidation module error is displayed and reseted", async () => {
    render(<Certification DataProvider={IdeProvider} />, {
      wrapper: Providers,
    });

    const certificationResultsEvent = new MessageEvent("message", {
      origin: "vscode-webview://",
      data: { command: "setCertificationResults", payload: CERTS_PAYLOAD },
    });

    act(() => {
      window.dispatchEvent(certificationResultsEvent);
    });

    const runLintingButton = screen.getByTestId("RevalidateButton-API Sample-DESIGN");
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

    expect(screen.queryByTestId("CertificationPage-NetworkError")).toBeInTheDocument();
    expect(runLintingButton).not.toHaveAttribute("data-loading", "true");
  });
});

async function checkApiSampleContent() {
  const tabContainer = within(await screen.findByTestId("ApiValidation-API Sample-REST"));

  expect(screen.getByTestId("ApiHeading-Badge-API Sample-REST")).toHaveTextContent("REST");
  expect(screen.getByTestId("ApiHeading-RatingScore-API Sample-REST")).toHaveTextContent("D");

  expect(tabContainer.getByTestId("AccordionControlTitle-DESIGN")).toBeInTheDocument();
  expect(tabContainer.getByTestId("AccordionControlTitle-SECURITY")).toBeInTheDocument();
  expect(tabContainer.getByTestId("AccordionControlTitle-DOCUMENTATION")).toBeInTheDocument();

  expect(tabContainer.getByTestId("ScoreLabel-DESIGN")).toHaveTextContent("C");
  expect(tabContainer.getByTestId("ScoreLabel-SECURITY")).toHaveTextContent("A+");
  expect(tabContainer.getByTestId("ScoreLabel-DOCUMENTATION")).toHaveTextContent("A");

  const designValidationResult = tabContainer.getByTestId("ValidationResult-DESIGN");
  expect(within(designValidationResult).getByText("This error is only on first pass")).toBeInTheDocument();
  expect(within(designValidationResult).getByText("Property name has to be camelCase")).toBeInTheDocument();

  const securityValidationResult = tabContainer.getByTestId("ValidationResult-SECURITY");
  expect(within(securityValidationResult).getByText("Global 'security' field is not defined")).toBeInTheDocument();
  expect(within(securityValidationResult).getByText("Server objects should support https")).toBeInTheDocument();
  expect(within(securityValidationResult).getByText('"schema.format" property must be defined')).toBeInTheDocument();

  const documentationValidationResult = tabContainer.getByTestId("ValidationResult-DOCUMENTATION");
  expect(within(documentationValidationResult).getByText("Bare URL used")).toBeInTheDocument();
}
