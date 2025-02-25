// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiHeading from "../../components/api-heading";
import Validation from "../../components/validation";
import { Flex } from "@mantine/core";
import type {
  Certification,
  CertificationPayload,
  ModuleMetadata,
  RevalidateModule,
} from "../../../types";

type ApiValidationProps = {
  api: Certification;
  rootPath: CertificationPayload["rootPath"];
  definitionPath: string;
  moduleMetadata: ModuleMetadata;
  apiRevalidationMetadata: ModuleMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
};

export default function ApiValidation({
  api,
  definitionPath,
  rootPath,
  moduleMetadata,
  apiRevalidationMetadata,
  revalidateModule,
  revalidateApi,
}: Readonly<ApiValidationProps>) {
  const { apiName, apiProtocol, score, ratingDescription, result } = api;
  return (
    <Flex
      direction="column"
      gap="sm"
      maw="100%"
      py="sm"
      data-testid={`ApiValidation-${apiName}-${apiProtocol}`}
    >
      <ApiHeading
        name={apiName}
        protocol={apiProtocol}
        score={score}
        ratingDescription={ratingDescription}
        definitionPath={definitionPath}
        apiRevalidationMetadata={apiRevalidationMetadata}
        revalidateApi={revalidateApi}
      />

      <Validation
        result={result}
        metadata={{ apiName, apiProtocol }}
        rootPath={rootPath}
        definitionPath={definitionPath}
        moduleMetadata={moduleMetadata}
        revalidateModule={revalidateModule}
      />
    </Flex>
  );
}
