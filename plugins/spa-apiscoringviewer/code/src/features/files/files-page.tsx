// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import FilesForm from "features/files/components/files-form";
import React, { useEffect } from "react";
import { sendMessageVscode } from "utils/send-message-vscode";

export default function FilesPage() {
  useEffect(() => {
    sendMessageVscode("onFileLoaded", {});
  }, []);

  return (
    <div data-testid="FilesPage" style={{ width: "100%" }}>
      <FilesForm />
    </div>
  );
}
