// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "types";

const CODE_VALIDATION_TYPES: ValidationType[] = [ValidationType.DESIGN, ValidationType.SECURITY];

export default function isCodeValidation(type: ValidationType) {
  return CODE_VALIDATION_TYPES.includes(type);
}
