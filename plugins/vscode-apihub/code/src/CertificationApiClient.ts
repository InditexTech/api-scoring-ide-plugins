import axios, { AxiosResponse, Method } from 'axios';
import * as fs from 'fs';
import { ValidationModuleType } from './webview/webview';
// eslint-disable-next-line @typescript-eslint/naming-convention
const FormData = require('form-data');

export async function validateRepo(serviceUrl: string, zipFile: string, apiModule?: ValidationModuleType): Promise<AxiosResponse> {
    const form = new FormData();
    form.append('isVerbose', 'true');
    form.append('url', fs.createReadStream(zipFile), `apiHub-${Date.now()}.zip`);
    form.append('validationType', checkValidationType(apiModule?.validationType));

    const options = {
        method: 'POST' as Method,
        url: serviceUrl + (serviceUrl.endsWith('/') ? '' : '/') + 'validations',
        data: form,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; boundary=' + form._boundary,
        },
        timeout: 60000
    };
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    return axios(options)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.error(error);
            return error.response;
        })
        .finally(function(){
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        });
}

export async function validateFile(serviceUrl: string, content: any, fileName:any, apiProtocol: string): Promise<AxiosResponse> {
    const form = new FormData();
    form.append('url', await fs.createReadStream(content.fileName), fileName);
    form.append('apiProtocol', checkProtocol(apiProtocol));

    const options = {
        method: 'POST' as Method,
        url: serviceUrl + (serviceUrl.endsWith('/') ? '' : '/') + 'file-verify-protocol',
        data: form,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; boundary=' + form._boundary,
        },
        processData: false,
        timeout: 60000
    };
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    return axios(options)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.error(error);
            return error.response;
        })
        .finally(function(){
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        });
}

function checkValidationType(validationType: number | undefined): any {
    if(!validationType){
        return 4;
    }
    return validationType;
}

function checkProtocol(apiProtocol: string): any {
    switch(apiProtocol){
        case 'rest':
            return 1;
        case 'asyncapi':
            return 2;
        case 'grpc':
            return 3;
        default:
            return 1;
    }
}
export type ValidationsResults = ValidationsResult[];

export interface ValidationsResult {
    pipelineVersion: string;
    apiVersion: string;
    apiProductKey: string;
    apiName: string;
    apiProtocol: string;
    validationHash: string;
    validationDateTime: string;
    validationExecutorId: string;
    tagReference: string;
    documentationGrade: DocumentationGrade;
    lintingGrade: LintingGrade;
    securityGrade: SecurityGrade;
    rating: string;
    selfLink: SelfLink;
}

export interface DocumentationGrade {
    grade: string;
    description: string;
}

export interface LintingGrade {
    grade: string;
    description: string;
}

export interface SecurityGrade {
    grade: string;
    description: string;
}

export interface SelfLink {
    href: string;
}

