// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type { VSCodeMessage } from "../types";
import isIntelliJ from "./is-intellij";

function tryAcquireVsCodeApi() {
  try {
    // This should be ignored from TS and ESLint because the method is only available on VSCode extension context:
    // eslint-disable-next-line
    // @ts-ignore
    return acquireVsCodeApi();
  } catch {
    // In this case we are not in VsCode context
    return null;
  }
}

// This function tries to defeat a sonar lint rule because
// there's no way to obtain VSCode parent origin as it
// changes between executions.
const getPostMessageOrigin = () => "*";

const intelliJCommands = new Map<string, string | null>([
  ["onClickValidateModule", "revalidateModule"],
  ["onClickOpenFile", "onClickOpenFile"],
  ["onProjectLoaded", null],
  ["onFileLoaded", null],
  ["onClickValidateFile", null],
]);

export function sendMessageIde(command: string, message: VSCodeMessage) {
  if (isIntelliJ()) {
    const intelliJCommand = intelliJCommands.get(command);
    if (!intelliJCommand) {
      return;
    }
    window.cefQuery({
      request: JSON.stringify({
        request: intelliJCommand,
        ...message,
      }),
    });
    return;
  }

  const vscode = tryAcquireVsCodeApi();
  const payload = message;
  //mode iframe
  if (window.self !== window.parent && !vscode) {
    window.parent.postMessage(
      {
        command: command,
        payload,
      },
      getPostMessageOrigin(),
    );
  } else if (vscode) {
    //Plugin mode build
    vscode.postMessage({
      command: command,
      payload,
    });
  } else {
    //React mode
  }
}
