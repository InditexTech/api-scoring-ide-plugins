import * as vscode from 'vscode';

export type ValidationModuleType = {
    apiName: string;
    definitionPath?: string;
    validationType: string;
};

export type ValidationFileModuleType = {
    filePath: string;
    apiProtocol: string;
};

/**
 * VSCode to frontend communication.
 */
export interface CertificationFrontendIface {
    show(pathname:string): void;
    setCertificationResults(payload: { metadata: any; rootPath: string; results: any }): void;
    setModuleResults(payload: { apiModule: ValidationModuleType; results: any }): void;
    throwExtensionError(payload : Error) : void;

    setValidationRules(results: any): void;
    setFileResults(results: any): void;
    setValidationRulesError(payload : Error) : void;
    setFileResultsError(payload : Error) : void;
    onFileLoaded(payload: any):void;
}

/**
 * Frontend to VSCode communication.
 */
export interface CertificationFrontendControllerIface {
    setCertificationFrontend(frontend: CertificationFrontendIface): void;
    onProjectLoaded?(): void; // this is handled in html/iframe
    onFileLoaded?(): void; // this is handled in html/iframe
    onClickValidateModule(payload: ValidationModuleType): void;
    onClickOpenFile(payload: { fileName: string; infoPosition: { line: string; char: string; lastLine: string; lastchar: string } }): void;
    
    getValidationRules(): void;
    onClickValidateFile(payload: ValidationFileModuleType): void; 
}

export class CertificationServiceWebView implements CertificationFrontendIface {
    panel?: vscode.WebviewPanel;

    constructor(private context: vscode.ExtensionContext, private presenter: CertificationFrontendControllerIface) {}
     
    show(pathname:string) {
        if (this.panel) {
            if (!this.panel.visible) {
                this.panel.reveal(this.panel.viewColumn);
            }
            return;
        }

        this.panel = vscode.window.createWebviewPanel('apihub', 'APIHub Certification', vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        let url = vscode.workspace.getConfiguration('apiHub.certification.frontend').get<string>('url');
        if (url?.substring(url.length - 1) === "/") {    
            url = url.substring(0, url.length - 1);
        }
        this.panel.webview.html = this.getHtml(url! + pathname);

        this.panel.webview.onDidReceiveMessage(
            message => {
                const callback = (this.presenter as any)[message.command];
                if (callback && typeof callback === 'function') {
                    callback(message.payload);
                } else {
                    console.error(`Unknown callback command: ${message.command}`);
                }
            },
            undefined,
            this.context.subscriptions
        );

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }

    private postCommand(command: string, payload: any) {
        this.panel?.webview.postMessage({
            command,
            payload,
        });
    }

    setCertificationResults(payload: any): void {     
        this.postCommand('setCertificationResults', payload);
    }
    setModuleResults(payload: { apiModule: ValidationModuleType; results: any }): void {
        this.postCommand('setModuleResults', payload);
    }

    throwExtensionError(payload: Error) : void{
        this.postCommand('throwExtensionError', payload);
    }
    setValidationRulesError(payload: Error) : void{
        this.postCommand('setValidationRulesError', payload);
    }
    setFileResultsError(payload: Error) : void{
        this.postCommand('setFileResultsError', payload);
    }

    setValidationRules(payload: any): void {
        this.postCommand('setValidationRules', payload);
    }

    setFileResults(payload: any): void {
        this.postCommand('setFileResults', payload);
    }
    onFileLoaded(payload: any): void {
        this.postCommand('onFileLoaded',payload);
    }


    private getHtml(url: string) {
        return `
<html>
    <body style="margin: 0px; padding: 0px; overflow: hidden">
        <div style="position: fixed; height: 100%; width: 100%">
            <iframe
            id="iframe"
            src="${url}"
            frameborder="0"
            style="overflow: hidden; height: 100%; width: 100%"
            height="100%"
            width="100%"
            ></iframe>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const iframe = document.getElementById('iframe');

            window.addEventListener('message', event => {
                console.log('message on webview.html', event.source == iframe.contentWindow, event.data);
                if(event.source == iframe.contentWindow) {
                    if(event.data.command === 'onProjectLoaded') {
                        onProjectLoaded();
                    } else if(event.data.command === 'onFileLoaded') {
                        onFileLoaded();
                    } else {
                        vscode.postMessage(event.data);
                    }
                } else {
                    sendMessageToIframe(event.data);
                }
            });

            let iframeLoaded = false;
            let iframeQueue = [];
            function sendMessageToIframe(message) {
                if(!iframeLoaded) {
                    console.log('iframe not ready yet, queueing message', message);
                    iframeQueue.push(message);
                } else {
                    iframe.contentWindow.postMessage(message, '*');
                }
            }
            const onProjectLoaded = () => {
                console.log('onProjectLoaded: sending queued messages', iframeQueue);
                iframeLoaded = true;
                iframeQueue.forEach(message => sendMessageToIframe(message));
                iframeQueue = [];
            };
            const onFileLoaded = () => {
                console.log('onFileLoaded: sending queued messages', iframeQueue);
                iframeLoaded = true;
                iframeQueue.forEach(message => sendMessageToIframe(message));
                iframeQueue = [];
            };
        </script>
  </body>
</html>`;
    }
}

export class ResponseError extends Error {
    status!: number;
    code: any;
    message: any;
}
