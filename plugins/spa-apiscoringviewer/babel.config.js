// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  presets: [
    [require.resolve("@babel/preset-env")],
    [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
    [require.resolve("@babel/preset-typescript")],
  ],
};
