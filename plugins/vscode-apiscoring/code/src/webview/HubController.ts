// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { CertificationFrontendIface, CertificationFrontendControllerIface, ValidationModuleType, ValidationFileModuleType } from './webview';

export class HubController implements CertificationFrontendControllerIface {

    frontend?: CertificationFrontendIface; // back reference to webview

    setCertificationFrontend(frontend: CertificationFrontendIface): void {
        this.frontend = frontend;
    }

    onClickValidateFile(payload: ValidationFileModuleType): void {
        vscode.commands.executeCommand('apiScoring.certification.validateFile', payload);
    }

    getValidationRules(): void {
        vscode.commands.executeCommand('apiScoring.certification.getValidationRules');
    }

    onClickValidateModule(payload: ValidationModuleType): void {
        vscode.commands.executeCommand('apiScoring.certification.validateRepository', payload);
    }

    async onClickOpenFile(payload: { fileName: string; infoPosition: { line: string; char: string; lastLine: string; lastchar: string } }) {
        const fileUri = vscode.Uri.file(payload.fileName);
        vscode.window.showTextDocument(fileUri, { viewColumn: vscode.ViewColumn.One }).then(editor => {
            if (!payload.infoPosition.char) {
                payload.infoPosition.char = "0";
            }
            const start = new vscode.Position(+payload.infoPosition.line, +payload.infoPosition.char);
            if (!payload.infoPosition.lastLine || !payload.infoPosition.lastchar) {
                payload.infoPosition.lastLine = (parseInt(payload.infoPosition.line) - 1).toString();
                payload.infoPosition.lastchar = payload.infoPosition.char + 1;
            }
            const end = new vscode.Position(+payload.infoPosition.lastLine, +payload.infoPosition.lastchar);
            editor.selections = [new vscode.Selection(start, end)];
            editor.revealRange(new vscode.Range(start, end));
        });
    }
}
