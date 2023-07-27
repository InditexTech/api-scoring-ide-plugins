// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "../types";

export default function isDocValidation(type: ValidationType) {
  return type === "DOCUMENTATION";
}
