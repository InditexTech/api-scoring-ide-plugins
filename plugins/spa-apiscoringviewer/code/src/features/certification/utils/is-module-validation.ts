// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "types";

const types = [ValidationType.DESIGN, ValidationType.SECURITY, ValidationType.DOCUMENTATION];

export default function isModuleValidation(validationType: ValidationType) {
  return types.includes(validationType);
}
