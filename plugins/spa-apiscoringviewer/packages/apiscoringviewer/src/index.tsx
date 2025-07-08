// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

export { default as CertificationPage } from "./certification";
export { default as CodeValidation } from "./components/validation-result/code-validation";
export { default as IdeProvider } from "./certification/ide-data-provider";
export { default as FilesPage } from "./files";
export { default as useIdeCertification } from "./certification/hooks/use-ide-certification";
export { default as getModuleId } from "./certification/utils/get-module-id";
export { default as isIntelliJ } from "./utils/is-intellij";
export { default as isVsCode } from "./utils/is-vscode";
export { sendMessageIde, sendMessageVscode, sendMessageIntelliJ } from "./utils/send-message-ide";
export { theme } from "./theme";
export { default as messages } from "./locales";
export * from "./types";
export type * from "../declaration";

/**
 * @deprecated Use IdeProvider instead
 */
export { default as VSCodeDataProvider } from "./certification/ide-data-provider";
/**
 * @deprecated Use useIdeCertification instead
 */
export { default as useVSCodeCertification } from "./certification/hooks/use-ide-certification";
