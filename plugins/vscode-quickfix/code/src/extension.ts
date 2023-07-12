// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import { doInsertOrAppendToArrayCommand, doInsertOrUpdateCommand, doPrependCommand, doRemoveCommand, doRenamePropertyCommand } from './commands';
import { AutoFixCodeActions, loadAutoFixCodeActions } from './rules/rules';
import path = require('path');

export async function activate(context: vscode.ExtensionContext) {
    let customRuleSetFile = vscode.workspace.getConfiguration('vscode-spectral-autofix').get('rulesYmlFileLocation') as string;
    if (!customRuleSetFile) {
        customRuleSetFile = context.extensionPath + '/resources/rules.yml';
    } else if (!path.isAbsolute(customRuleSetFile) && vscode.workspace.workspaceFolders) {
        customRuleSetFile = path.join(vscode.workspace.workspaceFolders[0].uri.path, customRuleSetFile);
    }
    const autoFixCodeActions = await loadAutoFixCodeActions(vscode.Uri.file(customRuleSetFile));

    const autofixProvider = vscode.languages.registerCodeActionsProvider(
        ['yaml', 'json'],
        new AutofixSpectralCodeActionProvider(autoFixCodeActions),
        {
            providedCodeActionKinds: AutofixSpectralCodeActionProvider.providedCodeActionKinds,
        }
    );
    context.subscriptions.push(autofixProvider);

    context.subscriptions.push(vscode.commands.registerCommand('spectral.autofix.insertOrUpdate', doInsertOrUpdateCommand));
    context.subscriptions.push(vscode.commands.registerCommand('spectral.autofix.insertOrAppendToArray', doInsertOrAppendToArrayCommand));
    context.subscriptions.push(vscode.commands.registerCommand('spectral.autofix.prepend', doPrependCommand));
    context.subscriptions.push(vscode.commands.registerCommand('spectral.autofix.remove', doRemoveCommand));
    context.subscriptions.push(vscode.commands.registerCommand('spectral.autofix.renameProperty', doRenamePropertyCommand));
}

export function deactivate() {}

class AutofixSpectralCodeActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.Refactor];

    constructor(private autoFixCodeActions: { [key: string]: AutoFixCodeActions }) {}

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        cancellationT0ken: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
        const codeActions = context.diagnostics
            .flatMap(diagnostic => {
                if (diagnostic.source === 'spectral' && typeof diagnostic.code === 'string') {
                    return this.autoFixCodeActions[diagnostic.code]?.createActions(document, diagnostic);
                }
            })
            .filter(action => action !== undefined);
        return codeActions.length > 0 ? (codeActions as any) : undefined;
    }
}
