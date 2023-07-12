// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { act, render, screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import isVSCode from "utils/is-vscode";
import App from "components/app";

jest.mock("utils/is-vscode");

const isVsCodeMock = jest.mocked(isVSCode);

describe("renders app inside IDE", () => {
  beforeEach(() => {
    isVsCodeMock.mockReturnValue(true);
  });

  test("renders certification page", () => {
    act(() => {
      render(<App Router={createRouter(["/"])} />);
    });

    expect(screen.getByTestId("CertificationPage-Loading")).toBeInTheDocument();
  });

  test("renders files page", () => {
    act(() => {
      render(<App Router={createRouter(["/files"])} />);
    });

    expect(screen.getByTestId("File")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /Select protocol/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/ })).toBeInTheDocument();
  });
});

describe("renders app inside browser", () => {
  beforeEach(() => {
    isVsCodeMock.mockReturnValue(false);
  });

  test("renders certification page", () => {
    act(() => {
      render(<App Router={createRouter(["/protocols/REST/apis/API Sample"])} />);
    });

    expect(screen.getByTestId("CertificationPage-Loading")).toBeInTheDocument();
  });
});

function createRouter(initialEntries: MemoryRouterProps["initialEntries"]) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
}
