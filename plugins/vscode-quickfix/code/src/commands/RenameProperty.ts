// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { AutoFix, AutoFixParameter} from '../rules/rules';
import { getKeyLocationForJsonPath, parseWithPointers, getJsonPathForPosition, selectDocumentRange, resolveValue} from './utils';

/** Command that allows to rename a property from 
 * a document according to a diagnostic and a fix
 * 
 * @param document 
 * @param diagnostic 
 * @param fix 
 */
export const doRenamePropertyCommand = async (document: vscode.TextDocument, diagnostic: vscode.Diagnostic, fix: AutoFix) => {
    const parsed = parseWithPointers(document);
    const path = getJsonPathForPosition(document.languageId, parsed, diagnostic.range.start)?.join('.');
    const location = getKeyLocationForJsonPath(document.languageId, parsed as any, path!)!;
    const propertyName = path?.split('.').pop();

    const inputParameter: AutoFixParameter = { payload: propertyName };
    fix = { ...fix, parameters: fix.parameters || [] }; // don't mutate the original fix
    fix.parameters!.push(inputParameter);

    const value: string = await resolveValue(document, parsed, diagnostic, fix);
    const quotedValue = doQuoteAsExample(value, document.getText(location));

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, location, quotedValue);
    await vscode.workspace.applyEdit(edit);

    const selectLocation = new vscode.Range(location.start, new vscode.Position(location.start.line, location.start.character + quotedValue.length));
    selectDocumentRange(document, selectLocation);
};

function doQuoteAsExample(text: string, example: string): string {
    if (example.startsWith('"') && example.endsWith('"')) {
        return `"${text}"`;
    }
    if (example.startsWith("'") && example.endsWith("'")) {
        return `'${text}'`;
    }
    return text;
}