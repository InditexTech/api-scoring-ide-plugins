// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiHeading from "../../components/api-heading";
import Validation from "../../components/validation";
import { Flex } from "@mantine/core";
import type { Certification, CertificationPayload, ModuleMetadata, RevalidateModule } from "../../../types";

export default function ApiValidation({
  api,
  definitionPath,
  rootPath,
  moduleMetadata,
  apiRevalidationMetadata,
  revalidateModule,
  revalidateApi,
}: {
  api: Certification;
  rootPath: CertificationPayload["rootPath"];
  definitionPath: string;
  moduleMetadata: ModuleMetadata;
  apiRevalidationMetadata: ModuleMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
}) {
  const { apiName, apiProtocol, rating, ratingDescription, result } = api;
  return (
    <Flex direction="column" gap={0} maw="100%" py="sm" data-testid={`ApiValidation-${apiName}-${apiProtocol}`}>
      <ApiHeading
        name={apiName}
        protocol={apiProtocol}
        rating={rating}
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
