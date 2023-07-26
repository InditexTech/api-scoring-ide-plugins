// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { AutoFix } from '../rules/rules';
import {
    calculateIndent,
    calculateSelection,
    parseWithPointers,
    resolveValue,
    selectDocumentRange,
    stringify,
} from './utils';

/** Command that allows to insert a property before another 
 * to a document according to diagnostic and a fix
 * 
 * @param document 
 * @param diagnostic 
 * @param fix 
 */
export const doPrependCommand = async (document: vscode.TextDocument, diagnostic: vscode.Diagnostic, fix: AutoFix) => {
    const parsed = parseWithPointers(document);
    const location = diagnostic.range;
    const indentation = calculateIndent(document, location.start) + 2;
    const insertPosition = new vscode.Position(location.start.line + 1, 0);

    const edit = new vscode.WorkspaceEdit();
    let payload = await resolveValue(document, parsed, diagnostic, fix);
    payload = fix.path ? Object.values(payload)[0] : payload; // extract first property value, like: { prop: value } => value
    const yml = stringify(payload, document.languageId, indentation);
    edit.insert(document.uri, insertPosition, yml);
    await vscode.workspace.applyEdit(edit);
    selectDocumentRange(document, calculateSelection(location.start, yml));
};
