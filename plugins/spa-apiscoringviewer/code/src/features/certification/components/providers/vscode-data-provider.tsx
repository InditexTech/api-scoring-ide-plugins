// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import useVSCodeCertification from "features/certification/hooks/use-vscode-certification";
import getModuleId from "features/certification/utils/get-module-id";
import {
  DataProviderChildFn,
  ModuleValidation,
  ModulesMetadata,
  SetCertificationResults,
  SetModuleResults,
  ValidationType,
} from "types";
import { useCallback, useEffect, useState } from "react";
import isIntelliJ from "utils/is-intellij";
import { sendMessageVscode } from "utils/send-message-vscode";

export default function VSCodeDataProvider({ children }: { children: DataProviderChildFn }) {
  return children(useVSCodeDataProvider());
}

function useVSCodeDataProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [certification, dispatch] = useVSCodeCertification();
  const [apisRevalidationMetadata, setApisRevalidationMetadata] = useState<ModulesMetadata>({});
  const [modulesMetadata, setModulesMetadata] = useState<ModulesMetadata>({});

  const onMessageReceived = useCallback(
    ({ origin, data }: MessageEvent<SetCertificationResults | SetModuleResults>) => {
      //origin is vsCode or intelliiJ
      if (origin.startsWith("vscode-webview://") || origin === "null") {
        const { command, payload } = data;
        if (command === "setCertificationResults") {
          dispatch({ type: "replace", payload });
          setLoading(false);
        } else if (command === "setModuleResults") {
          // Patch certification payload and add new info
          dispatch({ type: "patch", payload });
          // Update module metadata
          const {
            apiModule: { apiName, apiSpecType, validationType },
          } = payload;

          if (validationType === ValidationType.OVERALL_SCORE) {
            // The inconming validation is an API validation.
            setApisRevalidationMetadata((prev) => ({ ...prev, [apiName]: { loading: false } }));
          } else {
            // The inconming validation is an API module validation.
            const moduleId = getModuleId({ apiName, apiProtocol: apiSpecType });
            setModulesMetadata((prev) => ({ ...prev, [moduleId]: { loading: false } }));
          }
        } else if (command === "throwExtensionError") {
          const extensionError = new Error();
          setError(extensionError);
          setLoading(false);
          // Reset all modules metadata
          setModulesMetadata(resetModulesMetadata);
          setApisRevalidationMetadata(resetModulesMetadata);
        }
      }
    },
    [dispatch],
  );

  const revalidateApi = useCallback((validationBody: ModuleValidation) => {
    const { apiName } = validationBody;
    setApisRevalidationMetadata((prev) => ({ ...prev, [apiName]: { loading: true } }));

    sendMessageVscode("onClickValidateModule", validationBody);
  }, []);

  const revalidateModule = useCallback((validationBody: ModuleValidation) => {
    const { apiName, apiSpecType } = validationBody;
    const moduleId = getModuleId({ apiName, apiProtocol: apiSpecType });
    setModulesMetadata((prev) => ({ ...prev, [moduleId]: { loading: true } }));

    sendMessageVscode("onClickValidateModule", validationBody);
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessageReceived);

    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [onMessageReceived]);

  useEffect(() => {
    if (!isIntelliJ()) {
      setLoading(true);
    }
    sendMessageVscode("onProjectLoaded", {});
  }, []);

  return {
    certification,
    loading,
    error,
    modulesMetadata,
    apisRevalidationMetadata,
    revalidateModule,
    revalidateApi,
  };
}

function resetModulesMetadata(prev: ModulesMetadata) {
  return Object.entries(prev).reduce(
    (memo, [key, value]) => ({
      ...memo,
      [key]: { ...value, loading: false },
    }),
    {},
  );
}