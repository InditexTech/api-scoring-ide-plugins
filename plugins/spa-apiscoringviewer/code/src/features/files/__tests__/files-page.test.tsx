// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FileReaderMock, Providers, VALIDATION_FILE_RESULT, createJSONFile } from "utils/test-utils";
import FilesPage from "../files-page";

const postMessage = jest.fn();

beforeAll(() => {
  Object.defineProperty(global.window, "parent", {
    value: {
      postMessage,
    },
    writable: true,
  });
});

test("file results are displayed", async () => {
  const fileReader = new FileReaderMock();

  fileReader.result = "";
  jest.spyOn(window, "FileReader").mockImplementation(() => fileReader);

  act(() => {
    render(<FilesPage />, { wrapper: Providers });
  });

  expect(postMessage).toHaveBeenCalled();
  expect(postMessage).toHaveBeenCalledTimes(1);
  expect(postMessage).toHaveBeenCalledWith(
    {
      command: "onFileLoaded",
      payload: {},
    },
    "*",
  );

  postMessage.mockClear();

  const fileInput = screen.getByTestId("File").querySelector("input") as HTMLInputElement;

  const file = createJSONFile();
  await userEvent.upload(fileInput!, file);

  expect(fileInput.files?.[0]).toStrictEqual(file);

  await userEvent.click(screen.getByRole("searchbox", { name: /Select protocol/ }));
  await userEvent.click(screen.getByRole("option", { name: /gRPC/ }));

  fireEvent.submit(screen.getByRole("button", { name: /submit/ }));

  expect(screen.getByTestId("FilesPage-Loader")).toBeInTheDocument();

  expect(postMessage).toHaveBeenCalled();
  expect(postMessage).toHaveBeenCalledTimes(1);
  expect(postMessage).toHaveBeenCalledWith(
    {
      command: "onClickValidateFile",
      payload: {
        filePath: "/Users/inditex/path/to/file.json",
        apiProtocol: "grpc",
      },
    },
    "*",
  );

  const validationSuccessEvent = new MessageEvent("message", {
    origin: "vscode-webview://",
    data: { command: "setFileResults", payload: VALIDATION_FILE_RESULT },
  });

  await act(async () => {
    window.dispatchEvent(validationSuccessEvent);
  });

  expect(screen.getByTestId("Issue-/Users/inditex/path/to/file.json-global-doc-0-0-6-20-0")).toBeInTheDocument();
  expect(screen.getByText("Definition `doc` must be present and non-empty string in all types")).toBeInTheDocument();

  // Unhappy path
  const validationErrorEvent = new MessageEvent("message", {
    origin: "vscode-webview://",
    data: { command: "setFileResultsError", payload: new Error("Some error") },
  });

  await act(async () => {
    window.dispatchEvent(validationErrorEvent);
  });

  expect(screen.getByTestId("FilesForm-ValidationError")).toBeInTheDocument();
});
