import { ProtocolType } from "types";
import { useMemo } from "react";
import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { api } from "api/api";
import type { CertificationPayload, DataProviderChildFn, ValidationResponse } from "types";

type URLParams = {
  protocol: string;
  api: string;
};

export default function NetworkDataProvider({ children }: { children: DataProviderChildFn }) {
  const { protocol = "", api: apiName = "" } = useParams<URLParams>();
  const params = useMemo(
    () =>
      new URLSearchParams({
        apiName,
        apiProtocol: protocol.toUpperCase(),
        isVerbose: "true",
      }),
    [apiName, protocol],
  );
  const { result: certification, loading, error } = useValidation(params);

  return children({ certification, loading, error, modulesMetadata: {}, apisRevalidationMetadata: {} });
}

async function fetchValidations(params: URLSearchParams): Promise<CertificationPayload> {
  return api.validations.latest(params).then((apiValidationResponse: ValidationResponse) => {
    return {
      metadata: {
        apis: [
          {
            name: params.get("apiIdentifier") ?? "",
            apiSpecType: ProtocolType[(params.get("apiProtocol") as keyof typeof ProtocolType) ?? "REST"],
            definitionPath: "",
          },
        ],
      },
      results: [apiValidationResponse],
    };
  });
}

function useValidation(params: URLSearchParams) {
  return useAsync(fetchValidations, [params]);
}
