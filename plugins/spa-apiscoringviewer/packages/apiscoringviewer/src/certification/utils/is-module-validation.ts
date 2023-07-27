// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "../../types";

const types = ["DESIGN", "SECURITY", "DOCUMENTATION"];

export default function isModuleValidation(validationType: ValidationType) {
  return types.includes(validationType);
}
