// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import {
    parseWithPointers as parseWithPointersJson,
    getLocationForJsonPath as getLocationForJsonPathJson,
    getJsonPathForPosition as getJsonPathForPositionJson,
    JsonParserResult,
} from '@stoplight/json';
import {
    parseWithPointers as parseWithPointersYaml,
    // getLocationForJsonPath as getLocationForJsonPathYaml,
    getJsonPathForPosition as getJsonPathForPositionYaml,
    safeStringify as ymlStringify,
    YamlParserResult,
} from '@stoplight/yaml';
import {
    getLocationForJsonPath as getLocationForJsonPathYaml,
    getKeyLocationForJsonPath as getKeyLocationForJsonPathYaml,
} from '../stoplight/getLocationForJsonPathYaml';
import * as sources from '../sources';
import { SourceFunction } from '../sources';
import { AutoFix } from '../rules/rules';
import { IPosition } from '@stoplight/types';

export function selectDocumentRange(document: vscode.TextDocument, range: vscode.Range) {
    vscode.window.showTextDocument(document, { selection: range }).then(editor => {
        editor.selections = [new vscode.Selection(range.start, range.end)];
        editor.revealRange(range);
    });
}

/** Returns a Range of a path inside a parsed JSON or YAML document
 * 
 * @param languageId 
 * @param parsed 
 * @param path 
 * @returns 
 */
export function getKeyLocationForJsonPath(languageId: string, parsed: JsonParserResult<unknown> | YamlParserResult<unknown>, path: string) {
    // const getKeyLocation = languageId === 'yaml' ? getKeyLocationForJsonPathYaml : getKeyLocationForJsonPathYaml;  TODO: json format
    const location = getKeyLocationForJsonPathYaml(parsed as any, path.split('.'));
    if (location) {
        return new vscode.Range(location.range.start.line, location.range.start.character, location.range.end.line, location.range.end.character);
    }
    return null;
}

/** Returns a Position to insert text after a path in a JSON or YAML document
 * 
 * @param document 
 * @param parsed 
 * @param path 
 * @param position 
 * @returns 
 */
export function getInsertLocation(
    document: vscode.TextDocument,
    parsed: JsonParserResult<unknown> | YamlParserResult<unknown>,
    path: string,
    position: 'start' | 'end' = 'start'
) {
    if (document.languageId === 'yaml') {
        const parentProperty = path.substring(0, path.lastIndexOf('.'));
        const parentLocation = getLocationForJsonPath(document.languageId, parsed, parentProperty);
        if (parentLocation) {
            const parentFirstLine = document.lineAt(parentLocation.start.line + 1).text;
            const indentation = parentFirstLine.search(/\S/);
            const line = position === 'start' ? parentLocation.start.line : parentLocation.end.line;
            return new vscode.Position(line + 1, indentation);
        }
        return null;
    } else {
        throw new Error(`Inserting properties into ${document.languageId} is not supported yet`);
    }
}

/** Returns a number of indentations of a position inside a document
 * 
 * @param document 
 * @param position 
 * @returns 
 */
export function calculateIndent(document: vscode.TextDocument, position: vscode.Position) {
    const line = document.lineAt(position.line);
    const indentation = line.text.search(/\S/);
    return indentation;
}

/** Returns a Range starting from position and adding to another position
 * 
 * @param startPosition 
 * @param text 
 * @returns 
 */
export function calculateSelection(startPosition: vscode.Position, text: string) {
    return new vscode.Range(startPosition, calculateEndPosition(startPosition, text));
}

/** Returns a Position that results from the adition of a text to another position
 * 
 * @param startPosition 
 * @param text 
 * @returns 
 */
export function calculateEndPosition(startPosition: vscode.Position, text: string) {
    const lines = text.split('\n');
    return new vscode.Position(startPosition.line + lines.length - 1, startPosition.character + lines[lines.length - 1].length);
}

export function stringify(value: any, languageId: 'yaml' | 'json' | string = 'yaml', indentation = 0): string {
    let str = languageId === 'yaml' ? ymlStringify(value) : JSON.stringify(value, null, 2);
    if (indentation > 0 && languageId === 'yaml' && str.includes('\n')) {
        const indent = ' '.repeat(indentation);
        str = str
            .split('\n')
            .map(line => (line.length > 0 ? indent + line : line))
            .join('\n');
    }
    return str;
}

/** Returns the parsing of JSON or YAML document
 * 
 * @param document 
 * @returns 
 */
export function parseWithPointers(document: vscode.TextDocument): JsonParserResult<unknown> | YamlParserResult<unknown> {
    const parse = document.languageId === 'yaml' ? parseWithPointersYaml : parseWithPointersJson;
    return parse(document.getText());
}

/** Returns a Range of a path of a parsed JSON or YAML document
 * 
 * @param languageId 
 * @param parsed 
 * @param path 
 * @returns 
 */
export function getLocationForJsonPath(languageId: string, parsed: JsonParserResult<unknown> | YamlParserResult<unknown>, path: string) {
    const getLocation = languageId === 'yaml' ? getLocationForJsonPathYaml : getLocationForJsonPathJson;
    const location = getLocation(parsed as any, path.split('.')); // FIXME: be careful with [] in path while splitting
    if (location) {
        return new vscode.Range(location.range.start.line, location.range.start.character, location.range.end.line, location.range.end.character);
    }
    return null;
}

/** Returns a JsonPath of a parsed JSON or YAML document starting from a position
 * 
 * @param languageId 
 * @param parsed 
 * @param position 
 * @returns 
 */
export function getJsonPathForPosition(languageId: string, parsed: JsonParserResult<unknown> | YamlParserResult<unknown>, position: IPosition) {
    const getJsonPath = languageId === 'yaml' ? getJsonPathForPositionYaml : getJsonPathForPositionJson;
    return getJsonPath(parsed as any, position);
}

/** Returns a value obtained from executing a function defined in a fix
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @returns 
 */
export async function resolveValue(
    document: vscode.TextDocument,
    parsed: JsonParserResult<unknown> | YamlParserResult<unknown>,
    diagnostic: vscode.Diagnostic,
    fix: AutoFix
) {
    let value = fix.payload;
    if (!value && fix.source) {
        const source: SourceFunction = (sources as any)[fix.source];
        if (typeof source === 'function') {
            const sourcedValue = await source(document, parsed, diagnostic, fix);
            value = sourcedValue || value;
        }
    }
    if (value && fix.parameters) {
        fix.parameters.forEach(async parameter => {
            const source = getSourceFunction(parameter.type, parameter.source);
            if (source) {
                const sourcedValue = await source(document, parsed, diagnostic, fix, parameter);
                if (sourcedValue !== undefined && parameter.path) {
                    set(value, parameter.path, sourcedValue);
                }
            }
        });
    }
    return value;
}

function getSourceFunction(type: string | undefined, source: string | undefined): SourceFunction | null {
    if (type === 'property') {
        const sourceFunction: SourceFunction = (sources as any)[source || ''];
        if (typeof sourceFunction === 'function') {
            return sourceFunction;
        }    
    }
    return null;
}

function set(obj: any, path: string, value: any) {
    const parts = path.split('.');
    const last = parts.pop();
    let current = obj;
    for (const part of parts) {
        if (current[part] === undefined) {
            current[part] = {};
        }
        current = current[part];
    }
    current[last!] = value;
}
