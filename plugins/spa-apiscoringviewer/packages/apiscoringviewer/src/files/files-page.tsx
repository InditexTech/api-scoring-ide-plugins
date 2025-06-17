// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from "react";
import FilesForm from "./components/files-form";
import { sendMessageVscode } from "../utils/send-message-vscode";
import { useMantineTheme } from "@mantine/core";

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
