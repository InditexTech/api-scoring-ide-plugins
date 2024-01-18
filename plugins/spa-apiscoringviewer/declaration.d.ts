// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

export declare function acquireVsCodeApi(): unknown | never;

declare global {
  interface Window {
    cefQuery: (query: { request: string }) => void;
  }

  interface File {
    path: string;
  }
}

export {};
