import { JsonParserResult } from '@stoplight/json';
import { YamlParserResult } from '@stoplight/yaml';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { calculateEndPosition, calculateIndent, calculateSelection, getInsertLocation, getJsonPathForPosition, getKeyLocationForJsonPath, getLocationForJsonPath, parseWithPointers, resolveValue, stringify } from '../../commands/utils';
import { AutoFix } from '../../rules/rules';

suite('utils Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    test('parseWithPointers JSON', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: '{"text": "example"}'});
        const parse = (parseWithPointers(document)as JsonParserResult<unknown>);
        assert.strictEqual("json", document.languageId);
        assert.strictEqual("text", parse.ast.children!![0].children!![0].value);
        assert.strictEqual("example", parse.ast.children!![0].children!![1].value);
    });

    test('parseWithPointers JSON with wrong format', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: 'text= "example"'});
        const parse = (parseWithPointers(document)as JsonParserResult<unknown>);
        assert.strictEqual("json", document.languageId);
        assert.strictEqual("InvalidSymbol", parse.diagnostics[0].message);
    });

    test('parseWithPointers YAML', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        assert.strictEqual("yaml", document.languageId);
        assert.strictEqual("text", parse.ast.mappings[0].key.value);
        assert.strictEqual("example", parse.ast.mappings[0].value.value);
    });

    test('stringify JSON', () => {
        assert.strictEqual('{\n  "text": "example"\n}', stringify({text: "example"}, "json"));
    });

    test('stringify YAML', () => {
        assert.strictEqual('text: "example"', stringify('text: "example"', "yaml"));
    });

    test('calculateIndent no tabs', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const indent = calculateIndent(document, document.positionAt(0));
        assert.strictEqual(0, indent);
    });

    test('calculateSelection', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const range = calculateSelection(document.positionAt(0), 'text: "example"');
        assert.strictEqual(true, range.isSingleLine);
        assert.strictEqual(0, range.start.character);
        assert.strictEqual(15, range.end.character);
    });

    test('calculateEndPosition', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        assert.strictEqual(15, position.character);
        assert.strictEqual(0, position.line);
    });

    test('getInsertLocation JSON', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: '{"text": "example"}'});
        assert.throws(function () {
            getInsertLocation(document, parseWithPointers(document), "example");
        })
    });

    test('getInsertLocation YAML', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const parse = parseWithPointers(document);
        const auxPosition = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('yaml', parse, auxPosition);
        const position = getInsertLocation(document, parse, json!![0] as string);        
        assert.strictEqual(null, position);
    });

    test('getKeyLocationForJsonPath JSON', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: '{"text": "example"}'});
        const parse = parseWithPointers(document);
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('json', parse, position);
        const range = getKeyLocationForJsonPath('json', parse, json!![0] as string);
        assert.strictEqual(null, range);

    });

    test('getKeyLocationForJsonPath YAML',async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const parse = parseWithPointers(document);
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('yaml', parse, position);
        const range = getKeyLocationForJsonPath('yaml', parse, json!![0] as string);
        assert.strictEqual(true, range!!.isSingleLine);
        assert.strictEqual(0, range!!.start.character);
        assert.strictEqual(4, range!!.end.character);
    });

    test('getLocationForJsonPath JSON', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: '{"text": "example"}'});
        const parse = parseWithPointers(document);
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('json', parse, position);
        const range = getLocationForJsonPath('json', parse, json!![0] as string);
        assert.strictEqual(true, range!!.isSingleLine);
        assert.strictEqual(9, range!!.start.character);
        assert.strictEqual(18, range!!.end.character);
    });

    test('getLocationForJsonPath YAML', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const parse = parseWithPointers(document);
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('yaml', parse, position);
        const range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        assert.strictEqual(true, range!!.isSingleLine);
        assert.strictEqual(6, range!!.start.character);
        assert.strictEqual(15, range!!.end.character);
    });

    test('getJsonPathForPosition JSON', async () => {
        const document = await vscode.workspace.openTextDocument({language: "json", content: '{"text": "example"}'});
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('json', parseWithPointers(document), position);
        assert.strictEqual("text", json!![0]);
    });

    test('getJsonPathForPosition YAML', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('yaml', parseWithPointers(document), position);
        assert.strictEqual("text", json!![0]);
    });

    test('resolveValue without payload', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: `servers:
          - url: 'http://abc.com'
        `});
        const parse = (parseWithPointers(document)as JsonParserResult<unknown>);
        const position = calculateEndPosition(document.positionAt(0), `servers:
        - url: 'http://abc.com'`);
        const json = getJsonPathForPosition('yaml', parse, position);
        const range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        const fix: AutoFix = {
            title: 'Test',
            command: 'insert',
            source: "addServerHttps"
        };
        const diagnostic: vscode.Diagnostic = {
            range: range!!,
            message: '[text]1',
            severity: vscode.DiagnosticSeverity.Error
        };

        const value = await resolveValue(document, parse, diagnostic, fix);

        assert.strictEqual("https://abc.com", value)
    });

    test('resolveValue with payload', async () => {
        const document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        const parse = (parseWithPointers(document)as JsonParserResult<unknown>);
        const position = calculateEndPosition(document.positionAt(0), 'text: "example"');
        const json = getJsonPathForPosition('yaml', parse, position);
        const range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        const fix: AutoFix = {
            title: 'Test',
            command: 'insert',
            payload: {},
            parameters: [
                {
                    type: "property",
                    source: "addBooleanPrefix",
                    path: "test",
                    payload: "test"
                }
            ]
        };
        const diagnostic: vscode.Diagnostic = {
            range: range!!,
            message: '[text]1',
            severity: vscode.DiagnosticSeverity.Error
        };

        const value = await resolveValue(document, parse, diagnostic, fix);

        assert.strictEqual("isTest", value.test)
    });
});
