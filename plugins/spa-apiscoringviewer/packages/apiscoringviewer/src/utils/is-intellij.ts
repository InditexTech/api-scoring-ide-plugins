// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

export default function isIntelliJ() {
  return "cefQuery" in window;
}
