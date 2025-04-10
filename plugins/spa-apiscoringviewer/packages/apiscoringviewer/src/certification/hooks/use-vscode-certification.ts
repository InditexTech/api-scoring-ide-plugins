// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { cloneDeep } from "lodash";
import { Reducer, useReducer } from "react";
import isModuleValidation from "../utils/is-module-validation";
import type {
  ApiIdentifier,
  Certification,
  CertificationPayload,
  ModulePayload,
  SetCertificationResults,
  SetModuleResults,
} from "../../types";

type CertificationAction<TApiIdentifier extends ApiIdentifier> =
  | { type: "replace"; payload: SetCertificationResults<TApiIdentifier>["payload"] }
  | { type: "patch"; payload: SetModuleResults["payload"] };

function reducer<TApiIdentifier extends ApiIdentifier>(
  state: CertificationPayload<TApiIdentifier> | null,
  { type, payload }: CertificationAction<TApiIdentifier>,
): CertificationPayload<TApiIdentifier> | null {
  switch (type) {
    case "replace":
      return { ...state, ...payload };
    case "patch": {
      if (!state?.results || !payload.results || payload.results.length === 0 || payload.results[0].result.length === 0) {
        return state;
      }
      return patchModuleResults(state, payload);
    }
    default:
      throw new Error();
  }
}

function patchModuleResults<TApiIdentifier extends ApiIdentifier>(
  prevState: SetCertificationResults<TApiIdentifier>["payload"],
  nextModuleState: SetModuleResults["payload"],
): CertificationPayload<TApiIdentifier> {
  const { results: prevResults, metadata: prevMetadata } = prevState;
  const { apiModule, results: validationResults } = nextModuleState;
  const { apiName, apiSpecType, validationType } = apiModule;

  const { result: moduleValidations, ...moduleInfo } = validationResults[0];
  const moduleValidation = moduleValidations[0];
  const nextCertificationResults: Certification<TApiIdentifier>[] = [];

  for (const apiResult of prevResults) {
    // Find the API that has to be patched.
    if (apiResult.apiProtocol === apiSpecType && apiResult.apiName === apiName) {
      if (isModuleValidation(validationType)) {
        // In this case, only one of linting, security or documentation module was validated.
        const nextResult = patchModuleValidation(apiResult.result, moduleValidation);
        const nextModuleInfo = { ...moduleInfo, rating: undefined };
        nextCertificationResults.push({ ...nextModuleInfo, result: nextResult } as Certification<TApiIdentifier>);
      } else {
        // In this case, all the API was validated. Do not confuse with all the apis validation.
        nextCertificationResults.push({ ...moduleInfo, result: moduleValidations } as Certification<TApiIdentifier>);
      }
    } else {
      // Keep other previous apis validations.
      nextCertificationResults.push(apiResult);
    }
  }

  return cloneDeep<CertificationPayload<TApiIdentifier>>({
    ...prevState,
    metadata: patchMetadata(prevMetadata, apiModule),
    results: nextCertificationResults,
  });
}

function patchMetadata<TApiIdentifier extends ApiIdentifier>(
  prevMetadata: CertificationPayload<TApiIdentifier>["metadata"],
  apiModule: ModulePayload["apiModule"],
) {
  const { apis: prevApisMetadata, ...rest } = prevMetadata;
  const { apiName, apiSpecType, apiDefinitionPath } = apiModule;

  const nextApis: CertificationPayload<TApiIdentifier>["metadata"]["apis"] = [];
  for (const apiMetadata of prevApisMetadata) {
    if (apiMetadata.name === apiName && apiMetadata.apiSpecType === apiSpecType) {
      nextApis.push({ ...apiMetadata, definitionPath: apiDefinitionPath ?? "" });
    } else {
      nextApis.push(apiMetadata);
    }
  }
  return { ...rest, apis: nextApis };
}

function patchModuleValidation(certificationResult: Certification["result"], moduleValidation: Certification["result"][number]) {
  const moduleValidationKey = Object.keys(moduleValidation)[0];
  const nextResult = [];
  for (const validationResult of certificationResult) {
    if (moduleValidationKey in validationResult) {
      nextResult.push(moduleValidation);
    } else {
      nextResult.push(validationResult);
    }
  }
  return nextResult;
}

export default function useVSCodeCertification<TApiIdentifier extends ApiIdentifier>() {
  return useReducer<Reducer<CertificationPayload<TApiIdentifier> | null, CertificationAction<TApiIdentifier>>>(reducer, null);
}
