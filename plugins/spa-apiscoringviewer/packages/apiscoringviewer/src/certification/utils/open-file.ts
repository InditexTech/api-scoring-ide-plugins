import { isIntelliJ, isVsCode } from "../..";
import { sendMessageVscode } from "../../utils/send-message-vscode";

type FileLocation = {
  startLine?: number;
  startCharacter?: number;
  endLine?: number;
  endCharacter?: number;
};

export default function openFile(
  filePath: string,
  { startLine, startCharacter, endLine, endCharacter }: FileLocation
) {
  const infoPosition = {
    line: startLine,
    char: startCharacter,
    lastLine: endLine,
    lastchar: endCharacter,
  };

  if (isVsCode()) {
    sendMessageVscode("onClickOpenFile", { fileName: filePath, infoPosition });
  } else if (isIntelliJ()) {
    window.cefQuery({
      request: JSON.stringify({
        request: "onClickOpenFile",
        fileName: filePath,
        infoPosition,
      }),
    });
  }
}
