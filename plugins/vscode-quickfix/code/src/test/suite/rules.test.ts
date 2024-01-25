// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { YamlParserResult } from '@stoplight/yaml';
import * as assert from 'assert';
import path = require('path');
import * as vscode from 'vscode';
import { getJsonPathForPosition, getLocationForJsonPath, parseWithPointers } from '../../commands/utils';
import { loadAutoFixCodeActions } from '../../rules/rules';

suite('rules Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    let exampleDocument: vscode.TextDocument;
    let diagnostic: vscode.Diagnostic;
    setup(async () => {
        const file = path.join(__dirname, "..", "..", "..", "src", "test", "resources", "rules.yml");
        exampleDocument = await vscode.workspace.openTextDocument(file);

        const auxFile = path.join(__dirname, "..", "..", "..", "src", "test", "resources", "example.yml");
        const auxDocument = await vscode.workspace.openTextDocument(auxFile);
        const parse = (parseWithPointers(auxDocument)as YamlParserResult<unknown>);
        const json = getJsonPathForPosition('yaml', parse, auxDocument.positionAt(0));
        const range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        diagnostic = {
            range: range!!,
            message: 'is not used in the path',
            severity: vscode.DiagnosticSeverity.Error
        };

    });

    test('loadAutoFixCodeActions', async () => {
        const autoFixCodeActions = await loadAutoFixCodeActions(exampleDocument.uri);
        assert.notStrictEqual(null, autoFixCodeActions['insert property']);

        const action = autoFixCodeActions['insert property'].createActions(exampleDocument, diagnostic);
        assert.strictEqual('fix example', (action as vscode.CodeAction).title)
        assert.strictEqual('spectral.autofix.insert', (action as vscode.CodeAction).command?.command)
    });
});