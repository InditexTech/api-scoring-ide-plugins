// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import type { ApiIdentifier } from "types";

export default function getModuleId({ apiName, apiProtocol }: Pick<ApiIdentifier, "apiName" | "apiProtocol">) {
  return `${apiName}-${apiProtocol}`;
}
