// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type { ApiIdentifier, ValidationType } from "../../types";

export default function getModuleId({
  apiName,
  apiProtocol,
  validationType,
}: Pick<ApiIdentifier, "apiName" | "apiProtocol"> & { validationType: ValidationType }) {
  return `${apiName}-${apiProtocol}-${validationType}`;
}
