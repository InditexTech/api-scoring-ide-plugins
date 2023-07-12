// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { cloneDeep } from "lodash";
import { useReducer } from "react";
import isModuleValidation from "../utils/is-module-validation";
import type {
  Certification,
  CertificationPayload,
  ModulePayload,
  SetCertificationResults,
  SetModuleResults,
} from "types";

type CertificationAction =
  | { type: "replace"; payload: SetCertificationResults["payload"] }
  | { type: "patch"; payload: SetModuleResults["payload"] };

function reducer(state: CertificationPayload | null, { type, payload }: CertificationAction) {
  switch (type) {
    case "replace":
      return { ...state, ...payload };
    case "patch": {
      if (
        !state ||
        !state.results ||
        !payload.results ||
        payload.results.length === 0 ||
        payload.results[0].result.length === 0
      ) {
        return state;
      }
      return patchModuleResuts(state, payload);
    }
    default:
      throw new Error();
  }
}

function patchModuleResuts(
  prevState: SetCertificationResults["payload"],
  nextModuleState: SetModuleResults["payload"],
): CertificationPayload {
  const { results: prevResults, metadata: prevMetadata } = prevState;
  const { apiModule, results: validationResults } = nextModuleState;
  const { apiName, apiSpecType, validationType } = apiModule;

  const { result: moduleValidations, ...moduleInfo } = validationResults[0];
  const moduleValidation = moduleValidations[0];
  const nextCertificationResults = [];

  for (const apiResult of prevResults) {
    // Find the API that has to be patched.
    if (apiResult.apiProtocol === apiSpecType && apiResult.apiName === apiName) {
      if (isModuleValidation(validationType)) {
        // In this case, only one of linting, security or documentation module was validated.
        const nextResult = patchModuleValidation(apiResult.result, moduleValidation);
        const nextModuleInfo = { ...moduleInfo, rating: undefined };
        nextCertificationResults.push({ ...nextModuleInfo, result: nextResult });
      } else {
        // In this case, all the API was validated. Do not confuse with all the apis validation.
        nextCertificationResults.push({ ...moduleInfo, result: moduleValidations });
      }
    } else {
      // Keep other previous apis validations.
      nextCertificationResults.push(apiResult);
    }
  }

  return cloneDeep({
    ...prevState,
    metadata: patchMetadata(prevMetadata, apiModule),
    results: nextCertificationResults,
  });
}

function patchMetadata(prevMetadata: CertificationPayload["metadata"], apiModule: ModulePayload["apiModule"]) {
  const { apis: prevApisMetadata, ...rest } = prevMetadata;
  const { apiName, apiSpecType, apiDefinitionPath } = apiModule;

  const nextApis: CertificationPayload["metadata"]["apis"] = [];
  for (const apiMetadata of prevApisMetadata) {
    if (apiMetadata.name === apiName && apiMetadata.apiSpecType === apiSpecType) {
      nextApis.push({ ...apiMetadata, definitionPath: apiDefinitionPath ?? "" });
    } else {
      nextApis.push(apiMetadata);
    }
  }
  return { ...rest, apis: nextApis };
}

function patchModuleValidation(
  certificationResult: Certification["result"],
  moduleValidation: Certification["result"][number],
) {
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

export default function useVSCodeCertification() {
  return useReducer(reducer, null);
}
