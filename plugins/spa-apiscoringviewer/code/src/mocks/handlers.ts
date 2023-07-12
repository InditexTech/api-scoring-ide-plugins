// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { Response, rest } from "msw";
import validations from "./validations.json";

export const handlers = [
  rest.get("/validation/latest", async () => {
    return new Response(JSON.stringify(validations), { status: 200 });
  }),
];
