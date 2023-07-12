// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { jestPreviewConfigure } from "jest-preview";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});
