import { useEffect } from "react";
import FilesForm from "./components/files-form";
import { sendMessageVscode } from "../utils/send-message-vscode";

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
