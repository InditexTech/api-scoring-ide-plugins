// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { isIntelliJ, isVsCode } from "../..";
import { sendMessageVscode } from "../../utils/send-message-vscode";

type FileLocation = {
  startLine?: number;
  startCharacter?: number;
  endLine?: number;
  endCharacter?: number;
};

export default function openFile(filePath: string, { startLine, startCharacter, endLine, endCharacter }: FileLocation) {
  const infoPosition = {
    line: startLine,
    char: startCharacter,
    lastLine: endLine,
    lastchar: endCharacter,
  };

  if (isIntelliJ()) {
    window.cefQuery({
      request: JSON.stringify({
        request: "onClickOpenFile",
        fileName: filePath,
        infoPosition,
      }),
    });
  } else if (isVsCode()) {
    sendMessageVscode("onClickOpenFile", { fileName: filePath, infoPosition });
  }
}
