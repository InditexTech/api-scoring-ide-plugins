// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as archiver from 'archiver';
import * as path from 'path';
import * as os from 'os';
import { parse } from '@stoplight/yaml';

const protocolsAvailable = ['rest/', 'grpc/', 'event/'];

export async function loadRepositoryMetadataYml(rootFolder?: string) {
    rootFolder = rootFolder || (await getRootFolder());
    if (!rootFolder) {
        return;
    }
    let text;

    if(await checkFileExists((path.join(rootFolder, 'metadata.yml')))){
        text = await vscode.workspace.fs.readFile(vscode.Uri.file(path.join(rootFolder, 'metadata.yml')));
    }else {
        throw new Error("Metadata file not found.");
    }
    return convertToOneNamingConvention(parse<any>(text.toString()));
}

function convertToOneNamingConvention(text : any){
    let apis: { name: string; apiSpecType: string; definitionPath: string; }[] = [];
    text.apis.forEach( (element:any) => {
        apis.push({
            name : element.name,
            apiSpecType: element["api-spec-type"],
            definitionPath: element["definition-path"]
        });
    });
    text.apis = apis;
    return text;
}

export async function checkFileExists(filePath : string) {
    return fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  };

export async function getRootFolder(): Promise<string | undefined> {
    const files = await vscode.workspace.findFiles('**/metadata.yml');
    let root = null;
    if (files.length === 1) {
        root = path.dirname(files[0].fsPath);
    } else {
        const selectedFolder = await vscode.window.showOpenDialog({
            canSelectMany: false,
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: 'Select Root Folder',
        });
        if (!selectedFolder) {
            return;
        }
        root = selectedFolder[0].fsPath;
    }
    return root;
}

export async function compressWorkspace(rootFolder?: string, metadata? : any): Promise<string | undefined> {
    rootFolder = rootFolder || (await getRootFolder());
    if (!rootFolder || !metadata) {
        return;
    }
    const destination = path.join(os.tmpdir(), `api-repo-${Date.now()}.zip`);
    await zipDirectory(rootFolder, destination, metadata);
    return destination;
}

function zipDirectory(sourceDir: string, outPath: string, metadata: any ) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    let foldersToCompress = metadata.apis.map((x: any) => x.definitionPath);

    return new Promise<void>((resolve, reject) => {
        archive.directory(sourceDir, false, entryData => {
            if(foldersToCompress.filter((x : string) => entryData.name.startsWith(x)).length > 0
            || entryData.name.includes("metadata.yml")){
                return entryData;
            }
            return false;
        });
        archive.on('error', err => reject(err)).pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

