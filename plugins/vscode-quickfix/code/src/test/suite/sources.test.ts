// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { YamlParserResult } from '@stoplight/yaml';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { calculateEndPosition, getJsonPathForPosition, getLocationForJsonPath, parseWithPointers } from '../../commands/utils';
import { AutoFix } from '../../rules/rules';
import { addBooleanPrefix, addDateSuffix, addDateTimeSuffix, addMissingParameter, addMissingResponseCode, addServerHttps, exampleProperty, gitUserEmail, gitUserName, isMissingPathParam, isUnusedPathParam, removeUnderScores, replaceUnderScoresWithDashes, toLowerCase } from '../../sources';

suite('sources Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    let document: vscode.TextDocument;
    
    let documentSecond: vscode.TextDocument;

    let parse: YamlParserResult<unknown>;
    let parseSecond: YamlParserResult<unknown>;
   
    let position: vscode.Position;
    
    let json: any;
    
    let range: vscode.Range | null;
    
    let diagnostic: vscode.Diagnostic;
    let diagnosticSecond: vscode.Diagnostic;
    let diagnosticThird: vscode.Diagnostic;

    let fix: AutoFix;
    let fixSecond: AutoFix;
    let fixThird: AutoFix;

    setup(async () => {
        document = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        documentSecond = await vscode.workspace.openTextDocument({language: "yaml", content: `servers:
        - url: 'http://abc.com'
        `});
        parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        parseSecond = (parseWithPointers(documentSecond)as YamlParserResult<unknown>);
        position = calculateEndPosition(document.positionAt(0), 'text: "example"');

        json = getJsonPathForPosition('yaml', parse, position);

        range = getLocationForJsonPath('yaml', parse, json!![0] as string);

        diagnostic = {
            range: range!!,
            message: '',
            severity: vscode.DiagnosticSeverity.Error
        };
        diagnosticSecond = {
            range: range!!,
            message: '[text]1',
            severity: vscode.DiagnosticSeverity.Error
        };
        diagnosticThird = {
            range: range!!,
            message: '` test ` id `test`',
            severity: vscode.DiagnosticSeverity.Error
        };

        fix = {
            title: 'Test',
            command: 'insert'
        };
        fixSecond = {
            title: 'Test',
            command: 'insert',
            parameters: [
                {
                    payload: "test"
                }
            ]
        };
        fixThird = {
            title: 'Test',
            command: 'insert',
            parameters: [
                {
                    payload: "tes_t_"
                }
            ]
        };

    });

	test('gitUserEmail', async () => {
        assert.strictEqual("get-this-from-git@gitexample.com", await gitUserEmail(document, parse, diagnostic, fix));
	});

    test('gitUserName', async () => {
        assert.strictEqual("Get User Name from Git", await gitUserName(document, parse, diagnostic, fix));
	});

    test('addMissingResponseCode', async () => {
        assert.strictEqual(undefined, (await addMissingResponseCode(document, parse, diagnosticSecond, fix)).test);
	});

    test('addServerHttps', async () => {
        assert.strictEqual("https://abc.com", (await addServerHttps(documentSecond, parseSecond, diagnosticSecond, fix)));
	});

    test('addBooleanPrefix', async () => {
        assert.strictEqual("isTest", (await addBooleanPrefix(documentSecond, parseSecond, diagnosticSecond, fixSecond)));
	});

    test('addDateSuffix', async () => {
        assert.strictEqual("testDate", (await addDateSuffix(documentSecond, parseSecond, diagnosticSecond, fixSecond)));
	});

    test('addDateTimeSuffix', async () => {
        assert.strictEqual("testDateTime", (await addDateTimeSuffix(documentSecond, parseSecond, diagnosticSecond, fixSecond)));
	});

    test('toLowerCase', async () => {
        fix = {
            title: 'Test',
            command: 'insert',
            parameters: [
                {
                    payload: "TEST"
                }
            ]
        };
        assert.strictEqual("test", (await toLowerCase(document, parse, diagnostic, fix)));
	});

    test('removeUnderScores', async () => {
        assert.strictEqual("test", (await removeUnderScores(documentSecond, parseSecond, diagnosticSecond, fixThird)));
	});

    test('replaceUnderScoresWithDashes', async () => {
        assert.strictEqual("tes-t-", (await replaceUnderScoresWithDashes(documentSecond, parseSecond, diagnosticSecond, fixThird)));
	});

    test('isMissingPathParam', async () => {
        diagnostic = {
            range: range!!,
            message: 'The operation does not define the parameter',
            severity: vscode.DiagnosticSeverity.Error
        };
        assert.strictEqual(true, isMissingPathParam(documentSecond, diagnostic, fixThird));
	});

    test('isUnusedPathParam', async () => {
        diagnostic = {
            range: range!!,
            message: 'is not used in the path',
            severity: vscode.DiagnosticSeverity.Error
        };
        assert.strictEqual(true, isUnusedPathParam(documentSecond, diagnostic, fixThird));
	});

    test('addMissingParameter', async () => {
        document = await vscode.workspace.openTextDocument({language: "yaml", content: `paths:
          'test': test`});
        parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        position = calculateEndPosition(document.positionAt(0), `paths:
          'test': test`);
        json = getJsonPathForPosition('yaml', parse, position);
        range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        diagnosticThird.range = range!!;        

        const property = await addMissingParameter(document, parse, diagnosticThird, fixThird);
        assert.strictEqual("test", property.name);
        assert.strictEqual("path", property.in);
        assert.strictEqual(true, property.required);
        assert.strictEqual("string", property.schema.type);
        assert.strictEqual("Consumer identifier", property.description);
	});

    test('exampleProperty number', async () => {
        document = await vscode.workspace.openTextDocument({language: "yaml", content: `code:
        type: string
        maxLength: 3
        pattern: ^[1-5]{1}[0-9]{2}$
        description: Error code
        example: "400"
        `});
        parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        json = getJsonPathForPosition('yaml', parse, document.positionAt(0));
        range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        diagnosticThird.range = range!!;        
        const example = await exampleProperty(document, parse, diagnosticThird, fixThird);
        assert.strictEqual("Example string ABC def 123", example);
    })

    test('exampleProperty enum', async () => {
        document = await vscode.workspace.openTextDocument({language: "yaml", content: `level:
        type: string
        description: Error level
        example: ERROR
        enum:
        - INFO
        `});
        parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        json = getJsonPathForPosition('yaml', parse, document.positionAt(0));
        range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        diagnosticThird.range = range!!;        

        const example = await exampleProperty(document, parse, diagnosticThird, fixThird);
        assert.strictEqual("", example);
    })

    test('exampleProperty number with maximum and minimum', async () => {
        document = await vscode.workspace.openTextDocument({language: "yaml", content: `code:
        type: number
        description: Error code
        example: 400
        maximum: 600
        minimum: 100
        `});
        parse = (parseWithPointers(document)as YamlParserResult<unknown>);
        json = getJsonPathForPosition('yaml', parse, document.positionAt(0));
        range = getLocationForJsonPath('yaml', parse, json!![0] as string);
        diagnosticThird.range = range!!;        

        const example = await exampleProperty(document, parse, diagnosticThird, fixThird);
        assert.strictEqual(true, example > 100);
        assert.strictEqual(true, example < 600);
    })
});