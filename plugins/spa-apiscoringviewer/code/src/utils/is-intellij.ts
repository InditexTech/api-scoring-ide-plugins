// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

export default function isIntelliJ() {
  return "cefQuery" in window;
}
