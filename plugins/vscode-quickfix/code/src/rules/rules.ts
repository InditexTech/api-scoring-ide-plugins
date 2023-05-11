import * as vscode from 'vscode';
import * as fs from 'fs';
import { parse } from '@stoplight/yaml';
import * as sources from '../sources';

interface AutoFixRule {
    problem: string | string[];
    fixes: AutoFix[];
}

export interface AutoFix {
    title: string;
    problemMatcher?: string;
    command: 'insert' | 'insertOrUpdate' | 'remove' | 'renameProperty';
    path?: string;
    position?: 'start' | 'end';
    payload?: any;
    source?: string;
    parameters?: AutoFixParameter[];
}

export interface AutoFixParameter {
    type?: 'property';
    path?: string;
    payload?: any;
    source?: string;
}

export class AutoFixCodeActions {
    constructor(private fixRules: AutoFix[]) {}

    createActions(document: vscode.TextDocument, diagnostic: vscode.Diagnostic) {
        const actions = this.fixRules.map(fix => {
            if (fix.problemMatcher) {
                const problemMatcher: sources.ProblemMatcherFunction = (sources as any)[fix.problemMatcher];
                if (!problemMatcher(document, diagnostic, fix)) {
                    return null;
                }
            }
            const action = new vscode.CodeAction(fix.title, vscode.CodeActionKind.QuickFix);
            action.command = {
                command: 'spectral.autofix.' + fix.command,
                title: fix.title,
                arguments: [document, diagnostic, fix],
            };
            return action;
        });
        return actions.length === 1 ? actions[0] : actions;
    }
}

export async function loadAutoFixCodeActions(uri: vscode.Uri): Promise<{ [key: string]: AutoFixCodeActions }> {
    const text = fs.readFileSync(uri.fsPath, 'utf8');
    const fixes: AutoFixRule[] = parse(text);

    const result: { [key: string]: AutoFixCodeActions } = {};
    fixes.forEach(fix => {
        const problems = Array.isArray(fix.problem) ? fix.problem : [fix.problem];
        problems.forEach(problem => {
            result[problem] = new AutoFixCodeActions(fix.fixes);
        });
    });
    return result;
}
