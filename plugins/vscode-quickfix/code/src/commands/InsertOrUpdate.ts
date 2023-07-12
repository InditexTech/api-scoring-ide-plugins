// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { AutoFix } from '../rules/rules';
import {
    calculateIndent,
    calculateSelection,
    getInsertLocation,
    getLocationForJsonPath,
    getJsonPathForPosition,
    parseWithPointers,
    resolveValue,
    selectDocumentRange,
    stringify,
} from './utils';

/** Command that allows to insert or update property 
 * to a document according to a diagnostic and a fix
 * 
 * @param document 
 * @param diagnostic 
 * @param fix 
 */
export const doInsertOrUpdateCommand = async (document: vscode.TextDocument, diagnostic: vscode.Diagnostic, fix: AutoFix) => {
    const parsed = parseWithPointers(document);
    const path = getJsonPathForPosition(document.languageId, parsed, diagnostic.range.start)?.join('.');
    if (!fix.path || path?.endsWith('.' + fix.path)) {
        // update
        let location = getLocationForJsonPath(document.languageId, parsed, path!)!;
        const edit = new vscode.WorkspaceEdit();
        let payload = await resolveValue(document, parsed, diagnostic, fix);
        const indentation = calculateIndent(document, location.start) + 2;
        const yml = stringify(payload, document.languageId, indentation);
        const ymlToInsert = yml.includes('\n') ? '\n' + yml : yml; // if object add start new line
        edit.replace(document.uri, location, ymlToInsert.trimEnd());
        vscode.workspace.applyEdit(edit);
        selectDocumentRange(document, calculateSelection(location.start, yml));
    } else {
        // insert
        const insertPosition = getInsertLocation(document, parsed, path + '.' + fix.path, fix.position || 'start');
        if (insertPosition) {
            const edit = new vscode.WorkspaceEdit();
            let payload = {} as any;
            payload[fix.path] = await resolveValue(document, parsed, diagnostic, fix);
            if(fix.title === 'Add missing response') {
                fix.path = Object.keys(payload)[0];
                payload = payload[fix.path];
            }
            const yml = stringify(payload, document.languageId, insertPosition.character);
            edit.insert(document.uri, new vscode.Position(insertPosition.line, 0), yml);
            await vscode.workspace.applyEdit(edit);
            selectDocumentRange(document, calculateSelection(insertPosition, yml));
        }
    }
};
