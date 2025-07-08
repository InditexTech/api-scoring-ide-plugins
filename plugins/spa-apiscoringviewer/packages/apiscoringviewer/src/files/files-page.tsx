// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from "react";
import FilesForm from "./components/files-form";
import { sendMessageIde } from "../utils/send-message-ide";

export default function FilesPage() {
  useEffect(() => {
    sendMessageIde("onFileLoaded", {});
  }, []);

  return (
    <div data-testid="FilesPage" style={{ width: "100%" }}>
      <FilesForm />
    </div>
  );
}
