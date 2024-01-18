// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from "vscode";
import * as fs from 'fs';

import { validateRepo, validateFile } from './CertificationApiClient';
import { HubController } from './webview/HubController';
import { CertificationFrontendIface, CertificationServiceWebView, ResponseError, ValidationModuleType, ValidationFileModuleType } from './webview/webview';
import { compressWorkspace, getRootFolder, loadRepositoryMetadataYml } from './WorkspaceManager';
import path = require("path");

let rootUri: string | undefined;

export async function activate(context: vscode.ExtensionContext) {
    let certificationFrontEnd: CertificationFrontendIface = new CertificationServiceWebView(context, new HubController());
    let fileTriggerActivate = false;

    let serviceUrl: string | undefined;
    let disposable = vscode.commands.registerCommand('apiScoring.certification.validateRepository', (apiModule?: ValidationModuleType) => {
        if (fileTriggerActivate) {
            certificationFrontEnd = new CertificationServiceWebView(context, new HubController());
            fileTriggerActivate = false;
        }
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Opening APIScoring',
                cancellable: true,
            },
            async (progress, token) => {
                let rootPath;
                if (apiModule && rootUri) {
                    rootPath = rootUri;
                } else {
                    rootPath = await getRootFolder();
                    rootUri = rootPath;
                }

                if (!rootPath || token.isCancellationRequested) {
                    return;
                }

                certificationFrontEnd.show("/");

                progress.report({ message: 'Compressing API workspace' });
                let metadata = await loadRepositoryMetadataYml(rootPath);
                const zipFileName = await compressWorkspace(rootPath, metadata);
                if (token.isCancellationRequested) {
                    return;
                }
                progress.report({ message: 'Sending local files to certification service' });
                serviceUrl = vscode.workspace.getConfiguration('apiScoring.certification.service').get<string>('url');
                if (!serviceUrl || serviceUrl.trim().length === 0) {
                    vscode.window.showErrorMessage('Certification service URL is not configured', 'Open Settings').then(item => {
                        if (item === 'Open Settings') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'apiScoring.certification.service.url');
                        }
                    });
                    let error = new ResponseError();
                    error.message = 'Certification service URL is not configured';
                    error.code = "Error Code";
                    certificationFrontEnd.throwExtensionError(error);
                    return;
                }
                const validationResponse = await validateRepo(serviceUrl, zipFileName!, apiModule);
                if (!validationResponse || validationResponse.status >= 300) {
                    vscode.window.showErrorMessage(
                        `Certification Service Error: ${validationResponse?.status || 'Timeout'} ${validationResponse?.statusText}`
                    );
                    let error = new ResponseError();
                    error.status = validationResponse?.status;
                    error.message = validationResponse?.data.description;
                    error.code = validationResponse?.statusText;
                    certificationFrontEnd.throwExtensionError(error);
                    return;
                }

                if (token.isCancellationRequested) {
                    return;
                }

                if (apiModule) {
                    progress.report({ message: 'Loading Module Validation Results' });
                    let apiValidationData = validationResponse.data.filter((x: { apiName: string; }) => x.apiName === apiModule.apiName);
                    certificationFrontEnd.setModuleResults({ results: apiValidationData, apiModule: apiModule });
                } else {
                    certificationFrontEnd.setCertificationResults({ metadata, rootPath, results: validationResponse.data });
                }
            }
        );
    });

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
    statusBarItem.text = 'APIScoring Certification';
    statusBarItem.tooltip = 'Validate local APIs & Open APIScoring Application';
    statusBarItem.color = '#00ff00';
    statusBarItem.command = {
        command: 'apiScoring.certification.validateRepository',
        title: 'Validate local APIs & Open APIScoring Application',
        tooltip: 'Validate local APIs & Open APIScoring Application',
    };
    statusBarItem.show();

    const statusBarFile = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 2);
    statusBarFile.text = 'APIScoring File Lint';
    statusBarFile.tooltip = 'Open APIScoring Application File & Validate API file with a ruleset';
    statusBarFile.color = '#00ff00';
    statusBarFile.command = {
        command: 'apiScoring.certification.getValidationRules',
        title: 'Open 360 Hub Application File & Validate API file with a ruleset',
        tooltip: 'Open 360 Hub Application File & Validate API file with a ruleset',
    };

    statusBarFile.show();

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(statusBarFile);

    let getValidationRules = vscode.commands.registerCommand('apiScoring.certification.getValidationRules', () => {
        if (!fileTriggerActivate) {
            certificationFrontEnd = new CertificationServiceWebView(context, new HubController());
            fileTriggerActivate = true;
        }

        certificationFrontEnd.onFileLoaded(null);
        certificationFrontEnd.show("/files");
    });

    let validateFile = vscode.commands.registerCommand('apiScoring.certification.validateFile', (response: ValidationFileModuleType) => {
        serviceUrl = vscode.workspace.getConfiguration('apiScoring.certification.service').get<string>('url');
        if (!serviceUrl || serviceUrl.trim().length === 0) {
            vscode.window.showErrorMessage('Certification service URL is not configured', 'Open Settings').then(item => {
                if (item === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'apiScoring.certification.service.url');
                }
            });
            let error = new ResponseError();
            error.message = 'Certification service URL is not configured';
            error.code = "Error Code";
            certificationFrontEnd.throwExtensionError(error);
            return;
        }
        vscode.workspace.openTextDocument(response.filePath).then((document) => {
            file(serviceUrl, document, response, certificationFrontEnd);
        });
    });
    context.subscriptions.push(getValidationRules);
    context.subscriptions.push(validateFile);
}

export async function file(serviceUrl: any, doc: any, response: ValidationFileModuleType, certificationFrontEnd: any) {

    let tmpDir: fs.PathLike;
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Loading Validation Results',
        cancellable: true,
    },
        async (progress, token) => {
            if (response.filePath) {
                try {
                    let ext = path.extname(response.filePath);
                    let fileName = 'file-to-verify-' + Date.now() + ext;
                    if (ext === ".proto") {
                        fileName = "a.proto";
                    }
                    const validationFileResponse = await validateFile(serviceUrl, doc, fileName, response.apiProtocol);
                    if (!validationFileResponse || validationFileResponse.status >= 300) {
                        vscode.window.showErrorMessage(
                            `Validate File Service Error: ${validationFileResponse?.status || 'Timeout'} ${validationFileResponse?.statusText}`
                        );
                        let error = new ResponseError();
                        error.status = validationFileResponse?.status;
                        error.message = validationFileResponse?.data.description;
                        error.code = validationFileResponse?.statusText;
                        certificationFrontEnd.setFileResultsError(error);
                        return;
                    }
                    certificationFrontEnd.setFileResults(validationFileResponse.data);
                    console.log("File Results", validationFileResponse.data);
                } catch (err: any) {
                    console.log('Error writing:' + err.message);
                } finally {
                    if (tmpDir) {
                        fs.rm(tmpDir, { recursive: true }, (err) => {
                            if (err) {
                                console.error(err.message);
                                return;
                            }
                        });
                    }
                }
            } else {
                vscode.window.showErrorMessage(
                    `FilePath is not valid`
                );
            }
        });
}

export function deactivate() { }