// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

declare module "core-js-pure/actual/array/group-by" {
  function groupBy<T>(collection: T[], callback: (item: T) => string): { [s: string]: T[] };
  export default groupBy;
}

declare interface File {
  path: string;
}
