// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "../types";

const CODE_VALIDATION_TYPES: ValidationType[] = [
  "LINTER",
  "DESIGN",
  "SECURITY",
];

export default function isCodeValidation(type: ValidationType) {
  return CODE_VALIDATION_TYPES.includes(type);
}
