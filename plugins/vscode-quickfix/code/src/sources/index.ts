import { JsonParserResult } from '@stoplight/json';
import { YamlParserResult, parseWithPointers } from '@stoplight/yaml';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { AutoFix, AutoFixParameter } from '../rules/rules';
import { randomInt } from 'crypto';

export type SourceFunction = (
    document: vscode.TextDocument,
    parsed: JsonParserResult<any> | YamlParserResult<any>,
    diagnostic: vscode.Diagnostic,
    fix: AutoFix,
    parameter?: AutoFixParameter
) => Promise<any>;

export type ProblemMatcherFunction = (document: vscode.TextDocument, diagnostic: vscode.Diagnostic, fix: AutoFix) => boolean;

export const selectRef: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    const selected = await promptForRef(parsed.data);
    return selected ? `'${selected}'` : undefined;
};

const promptForRef = async (oas: any, question?: string) => {
    const requestBodies = Object.keys(oas.components?.requestBodies || {}).map(s => `#/components/requestBodies/${s}`);
    const schemaNames = Object.keys(oas.components?.schemas || {}).map(s => `#/components/schemas/${s}`);
    const examples = Object.keys(oas.components?.examples || {}).map(s => `#/components/examples/${s}`);
    // show quick pick
    const items = [...requestBodies, ...schemaNames, ...examples];
    const selected = await vscode.window.showQuickPick(items, { canPickMany: false, title: question });
    return selected;
};

/** Returns an example of git user email
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const gitUserEmail: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    return 'get-this-from-git@gitexample.com';
};

/** Returns an example of a git user name
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const gitUserName: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    return 'Get User Name from Git';
};

/** Returns an example of a response
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const buildResponse: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    return {
        description: '',
        content: {
            'application/json': {
                schema: {
                    $ref: (await promptForRef(parsed.data)) || '#/components/schemas/Error',
                },
            },
        },
    };
};

/** Returns the missing response codes
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const addMissingResponseCode : SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    const responseCode = diagnostic.message.split('[')[1].split(']')[0];
    let extensionPath;
    if (vscode.extensions.getExtension("InditexTech.vscode-spectral-quickfix") !== undefined){
        extensionPath = vscode.extensions.getExtension("InditexTech.vscode-spectral-quickfix")!.extensionPath;
    } else{
        const message = "QUICKFIX: Working folder not found, open a folder and try again" ;
        vscode.window.showErrorMessage(message);
        return;
    }
    const uri = vscode.Uri.file(extensionPath + '/resources/response_code_examples.yaml');
    const text = fs.readFileSync(uri.fsPath, 'utf8');
    const responses : any = parseWithPointers(text);
    let obj :any  = {};
    obj[responseCode] = responses.data.responses[responseCode];
    return obj;
};

/** Returns an example of a number, string, string array, boolean or a value of the defined enum
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const exampleProperty: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    let type = "", maximum = 0, minimum = 0, isArray = false;
    for (let i = diagnostic.range.start.line; i <= diagnostic.range.end.line; i++) {
        let line =document.lineAt(i).text.trim();
        if(line.includes('type:')){
            type = line.split("type:")[1].trim();
            if(type === "array"){
                isArray = true;
            }
        }
        if(line.includes('enum:')){
            const example = line.split("enum:")[1].trim();
            let arrayExample = Array.from(example.substring(1,example.length-1).split(",")).map(x => x.trim());

            let min = Math.ceil(minimum);
            let max = Math.floor(arrayExample.length);
            let value = randomInt(min, max);

            return arrayExample[value];
        }
        if(line.includes('maximum:')){
            maximum = parseInt(line.split("maximum:")[1].trim());
        }
        if(line.includes('minimum:')){
            minimum = parseInt(line.split("minimum:")[1].trim());
        }
    }
    return getReturnValue(type, isArray, minimum, maximum);
};

/** Returns a string, string array, number or boolean depending of the type
 * 
 * @param type 
 * @param isArray 
 * @param minimum 
 * @param maximum 
 * @returns 
 */
const getReturnValue = (type: string, isArray: boolean, minimum: number, maximum: number): string | string[] | number | boolean => {
    if(type === "string"){
        if(isArray){
            return ["Exampl3", "str1ng"];
        }
        return "Example string ABC def 123";
    }
    if(type === "integer" || type === "number"){
        let min = Math.ceil(minimum);
        let max = Math.floor(maximum);
        return randomInt(min, max);
    }
    if(type === "boolean"){
        return Date.now()%2 === 0;
    }

    return "Example string ABC def 123";
}

/** Returns the server with HTTPS protocol
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @param parameter 
 * @returns 
 */
export const addServerHttps: SourceFunction = async (document, parsed, diagnostic, fix, parameter) => {
    for (const server of parsed.data.servers) {
        if(!server.url.includes("localhost") && !server.url.includes("https")){
            return server.url.replace("http", "https");
        }
    }
};

export const addBooleanPrefix: SourceFunction = async (document, parsed, diagnostic, fix) => {
    const input = fix?.parameters![0].payload;
    return 'is' + input[0].toUpperCase() + input.slice(1);
};

export const addDateSuffix: SourceFunction = async (document, parsed, diagnostic, fix) => {
    const input = fix?.parameters![0].payload;

    return input + 'Date';
};

export const addDateTimeSuffix: SourceFunction = async (document, parsed, diagnostic, fix) => {
    const input = fix?.parameters![0].payload;
    return input + 'DateTime';
};

export const toLowerCase: SourceFunction = async (document, parsed, diagnostic, fix) => {
    return fix?.parameters![0].payload.toLowerCase();
};

export const removeUnderScores: SourceFunction = async (document, parsed, diagnostic, fix) => {
    return fix?.parameters![0].payload.replace(/_/g, '');
};

export const replaceUnderScoresWithDashes: SourceFunction = async (document, parsed, diagnostic, fix) => {
    return fix?.parameters![0].payload.replace(/_/g, '-');
};

export const isMissingPathParam: ProblemMatcherFunction = (document, diagnostic, fix) => {
    return diagnostic.message.includes('The operation does not define the parameter');
};

export const isUnusedPathParam: ProblemMatcherFunction = (document, diagnostic, fix) => {
    return diagnostic.message.includes('is not used in the path');
};

/** Returns an object containing the parameter of a missing parameter
 * 
 * @param document 
 * @param parsed 
 * @param diagnostic 
 * @param fix 
 * @returns 
 */
export const addMissingParameter: SourceFunction = async (document, parsed, diagnostic, fix) => {
    const parameter = diagnostic.message.split('`')[1].slice(1, -1);
    if (parameter.includes('id') || parameter.includes('Id')) {
        const withId = {
            name: parameter,
            in: 'path',
            required: true,
            schema: {
                type: 'string',
            },
            description: 'Consumer identifier',
        };

        return withId;
    }
    return {
        name: parameter,
        in: 'path',
        required: true,
        schema: {
            type: 'string',
        },
        description: 'Consumer identifier',
    };
};