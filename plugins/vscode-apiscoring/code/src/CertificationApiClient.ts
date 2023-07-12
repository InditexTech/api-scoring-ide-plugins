// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse, Method } from 'axios';
import * as fs from 'fs';
import { ValidationModuleType } from './webview/webview';
// eslint-disable-next-line @typescript-eslint/naming-convention
const FormData = require('form-data');

export async function validateRepo(serviceUrl: string, zipFile: string, apiModule?: ValidationModuleType): Promise<AxiosResponse> {
    const form = new FormData();
    form.append('isVerbose', 'true');
    form.append('file', fs.createReadStream(zipFile), `apiScoring-${Date.now()}.zip`);
    form.append('validationType', checkValidationType(apiModule?.validationType));

    const options = {
        method: 'POST' as Method,
        url: serviceUrl + (serviceUrl.endsWith('/') ? '' : '/') + 'apis/validate',
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
        .finally(function () {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        });
}

export async function validateFile(serviceUrl: string, content: any, fileName: any, apiProtocol: string): Promise<AxiosResponse> {
    const form = new FormData();
    form.append('file', await fs.createReadStream(content.fileName), fileName);
    form.append('apiProtocol', checkProtocol(apiProtocol));

    const options = {
        method: 'POST' as Method,
        url: serviceUrl + (serviceUrl.endsWith('/') ? '' : '/') + 'apis/verify',
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
        .finally(function () {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        });
}

function checkValidationType(validationType: string | undefined): any {
    if (!validationType) {
        return "OVERALL_SCORE";
    }
    return validationType;
}

function checkProtocol(apiProtocol: string): any {
    switch (apiProtocol) {
        case 'rest':
            return "REST";
        case 'asyncapi':
            return "EVENT";
        case 'grpc':
            return "GRPC";
        default:
            return "REST";
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

