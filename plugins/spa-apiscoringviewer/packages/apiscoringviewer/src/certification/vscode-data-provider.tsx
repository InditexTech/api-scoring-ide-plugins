// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from "react";
import { DataProviderChildFn, ModulesMetadata, SetCertificationResults, SetModuleResults, ModuleValidation, ApiIdentifier } from "../types";
import isIntelliJ from "../utils/is-intellij";
import { sendMessageVscode } from "../utils/send-message-vscode";
import useVSCodeCertification from "./hooks/use-vscode-certification";
import getModuleId from "./utils/get-module-id";

export default function VSCodeDataProvider<TApiIdentifier extends ApiIdentifier>({
  children,
}: {
  children: DataProviderChildFn<TApiIdentifier>;
}) {
  return children(useVSCodeDataProvider<TApiIdentifier>());
}

function useVSCodeDataProvider<TApiIdentifier extends ApiIdentifier>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [certification, dispatch] = useVSCodeCertification<TApiIdentifier>();
  const [apisRevalidationMetadata, setApisRevalidationMetadata] = useState<ModulesMetadata>({});
  const [modulesMetadata, setModulesMetadata] = useState<ModulesMetadata>({});

  const onMessageReceived = useCallback(
    ({ origin, data }: MessageEvent<SetCertificationResults<TApiIdentifier> | SetModuleResults>) => {
      //origin is vsCode or intelliiJ
      if (origin.startsWith("vscode-webview://") || origin === "null") {
        const { command, payload } = data;
        if (command === "setCertificationResults") {
          dispatch({ type: "replace", payload });
          setLoading(false);
          setError(null);
        } else if (command === "setModuleResults") {
          // Patch certification payload and add new info
          dispatch({ type: "patch", payload });
          // Update module metadata
          const {
            apiModule: { apiName, apiSpecType, validationType },
          } = payload;

          if (validationType === "OVERALL_SCORE") {
            // The inconming validation is an API validation.
            setApisRevalidationMetadata((prev) => ({
              ...prev,
              [apiName]: { loading: false },
            }));
          } else {
            // The inconming validation is an API module validation.
            const moduleId = getModuleId({ apiName, apiProtocol: apiSpecType });
            setModulesMetadata((prev) => ({
              ...prev,
              [moduleId]: { loading: false },
            }));
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
    setApisRevalidationMetadata((prev) => ({
      ...prev,
      [apiName]: { loading: true },
    }));

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
