// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationType } from "types";

export default function isDocValidation(type: ValidationType) {
  return type === ValidationType.DOCUMENTATION;
}
