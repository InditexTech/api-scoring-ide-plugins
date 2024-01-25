// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { AutoFix } from '../rules/rules';
import { selectDocumentRange } from './utils';

/** Command that allows to remove a property from a 
 * document according to a diagnostic and a fix
 * 
 * @param document 
 * @param diagnostic 
 * @param fix 
 */
export const doRemoveCommand = async (document: vscode.TextDocument, diagnostic: vscode.Diagnostic, fix: AutoFix) => {
    const location = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.end.line + 1, 0);
    const edit = new vscode.WorkspaceEdit();
    edit.delete(document.uri, location);
    await vscode.workspace.applyEdit(edit);
    selectDocumentRange(document, new vscode.Range(location.start, location.start));
};
