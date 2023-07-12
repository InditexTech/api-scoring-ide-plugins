// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

export default function isVSCode() {
  // Of course, this is wrong!
  return window.self !== window.parent;
}
