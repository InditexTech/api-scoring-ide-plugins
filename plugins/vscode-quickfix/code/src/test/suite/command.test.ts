// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { YamlParserResult } from '@stoplight/yaml';
import * as assert from 'assert';
import path = require('path');
import * as vscode from 'vscode';
import { doInsertOrAppendToArrayCommand, doInsertOrUpdateCommand, doPrependCommand, doRemoveCommand, doRenamePropertyCommand } from '../../commands';
import { getJsonPathForPosition, getLocationForJsonPath, parseWithPointers } from '../../commands/utils';
import { AutoFix } from '../../rules/rules';

suite('commands Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    let file: string;
    let exampleDocument: vscode.TextDocument;
    let diagnostic: vscode.Diagnostic;
    let diagnosticSecond: vscode.Diagnostic;
    let fix: AutoFix;
    setup(async () => {
        file = path.join(__dirname, "..", "..", "..", "src", "test", "resources", "example.yml");
        exampleDocument = await vscode.workspace.openTextDocument(file);
        const parse = (parseWithPointers(exampleDocument)as YamlParserResult<unknown>);
        const json = getJsonPathForPosition('yaml', parse, exampleDocument.positionAt(16));
        const range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        fix = {
            title: 'Test',
            command: 'insert',
            source: "gitUserName",
            path: "title",
            payload: "test"
        };
        diagnostic = {
            range: range!!,
            message: 'is not used in the path',
            severity: vscode.DiagnosticSeverity.Error
        };
        const jsonSecond = getJsonPathForPosition('yaml', parse, exampleDocument.positionAt(0));
        const rangeSecond = getLocationForJsonPath('yaml', parse, jsonSecond!![0] as string);
        diagnosticSecond = {
            range: rangeSecond!!,
            message: 'is not used in the path',
            severity: vscode.DiagnosticSeverity.Error
        };
    });

	test('doInsertOrAppendToArrayCommand', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        await doInsertOrAppendToArrayCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual("test", data.info.title[0])
    });

    test('doInsertOrUpdateCommand', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        await doInsertOrUpdateCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual("test", data.info.title[0])
    });

    test('doInsertOrUpdateCommand add missing response', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        fix = {
            title: 'Add missing response',
            command: 'insertOrUpdate',
            source: "gitUserName",
            path: "title",
            payload: "test"
        };
        await doInsertOrUpdateCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual(null, data.info)
        assert.strictEqual('test title', data['test  title'])
    });

    test('doInsertOrUpdateCommand no fix path', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        await doInsertOrUpdateCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual(null, data.info)
        assert.strictEqual('test title', data['test  title'])
    });

    test('doPrependCommand', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        await doPrependCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual('test title', data['test  title'])
    });

    test('doRemoveCommand', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        await doRemoveCommand(document, diagnostic, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual(undefined, data.info)
    });

    test('doRenamePropertyCommand', async () => {
        const document = await vscode.workspace.openTextDocument(file);
        fix = {
            title: 'Add missing response',
            command: 'renameProperty',
            source: "gitUserName",
            path: "version",
            payload: "test"
        };
        await doRenamePropertyCommand(document, diagnosticSecond, fix);
        const data: any = parseWithPointers(document).data;
        assert.strictEqual("3.0.2", data!!.test)
    });
});