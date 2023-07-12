// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { YamlParserResult } from '@stoplight/yaml';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { calculateEndPosition, getJsonPathForPosition, parseWithPointers } from '../../commands/utils';
import { getKeyLocationForJsonPath, getLocationForJsonPath, getOuterLocationForJsonPath } from '../../stoplight/getLocationForJsonPathYaml';

suite('getLocationForJsonPathYaml Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    let exampleDocument: vscode.TextDocument;
    let parse: YamlParserResult<unknown>;
    let json: any;
    let auxPosition: vscode.Position;
    setup(async () => {
        exampleDocument = await vscode.workspace.openTextDocument({language: "yaml", content: 'text: "example"'})
        parse = (parseWithPointers(exampleDocument) as YamlParserResult<unknown>);
        auxPosition = calculateEndPosition(exampleDocument.positionAt(0), 'text: "example"');
        json = getJsonPathForPosition('yaml', parse, auxPosition);
    });

	test('getLocationForJsonPath', async () => {
        const location = getLocationForJsonPath(parse, json!!);
        assert.strictEqual(6, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(15, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
	});

    test('getLocationForJsonPath with mergeKeys', async () => {
        parse.metadata = {
            mergeKeys: true
        };
        json = getJsonPathForPosition('yaml', parse, auxPosition);
        const location = getLocationForJsonPath(parse, json!!);
        assert.strictEqual(6, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(15, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
        delete parse.metadata;
	});

    test('getOuterLocationForJsonPath', async () => {
        const location = getOuterLocationForJsonPath(parse, json!!);
        assert.strictEqual(0, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(15, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
	});

    test('getOuterLocationForJsonPath with mergeKeys', async () => {
        parse.metadata = {
            mergeKeys: true
        };
        json = getJsonPathForPosition('yaml', parse, auxPosition);
        const location = getOuterLocationForJsonPath(parse, json!!);
        assert.strictEqual(0, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(15, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
        delete parse.metadata;
    });

    test('getKeyLocationForJsonPath', async () => {
        const location = getKeyLocationForJsonPath(parse, json!!);
        assert.strictEqual(0, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(4, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
	});

    test('getKeyLocationForJsonPath mergeKeys true', async () => {
        parse.metadata = {
            mergeKeys: true
        };
        json = getJsonPathForPosition('yaml', parse, auxPosition);
        const location = getKeyLocationForJsonPath(parse, json!!);
        assert.strictEqual(0, location!!.range.start.character);
        assert.strictEqual(0, location!!.range.start.line);
        assert.strictEqual(4, location!!.range.end.character);
        assert.strictEqual(0, location!!.range.end.line);
        delete parse.metadata;
    });

    test('getKeyLocationForJsonPath reduceMergeKeys true', async () => {
        exampleDocument = await vscode.workspace.openTextDocument({language: "yaml", content: '<<: "example" \ntest: "test"'})
        parse = (parseWithPointers(exampleDocument)as YamlParserResult<unknown>);
        parse.metadata = {
            mergeKeys: true
        };
        auxPosition = calculateEndPosition(exampleDocument.positionAt(0), '<<: "example" \ntest: "test"');
        json = getJsonPathForPosition('yaml', parse, auxPosition);    
        const location = getKeyLocationForJsonPath(parse, json!!);
        assert.strictEqual(4, location?.range.end.character);
        assert.strictEqual(1, location?.range.end.line);
        assert.strictEqual(0, location?.range.start.character);
        assert.strictEqual(1, location?.range.start.line);
	});
});