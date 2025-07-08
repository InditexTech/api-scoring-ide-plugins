// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { sendMessageIde } from "../../utils/send-message-ide";

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

  sendMessageIde("onClickOpenFile", { fileName: filePath, infoPosition });
}
