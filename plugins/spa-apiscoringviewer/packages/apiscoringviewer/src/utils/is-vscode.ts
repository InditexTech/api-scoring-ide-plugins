// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

export default function isVsCode() {
  // Of course, this is wrong!
  return window.self !== window.parent;
}
