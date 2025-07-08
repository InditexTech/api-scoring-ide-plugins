// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiHeading from "../../components/api-heading";
import Validation from "../../components/validation";
import { Flex } from "@mantine/core";
import type {
  ApiIdentifier,
  Certification,
  CertificationPayload,
  ModuleMetadata,
  ModulesMetadata,
  RevalidateModule,
  ScoreFormat,
} from "../../../types";

type ApiValidationProps<TApiIdentifier extends ApiIdentifier> = {
  api: Certification;
  rootPath: CertificationPayload<TApiIdentifier>["rootPath"];
  definitionPath: string;
  apiRevalidationMetadata: ModuleMetadata;
  modulesMetadata: ModulesMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
  scoreFormat: ScoreFormat;
};

export default function ApiValidation<TApiIdentifier extends ApiIdentifier>({
  api,
  definitionPath,
  rootPath,
  apiRevalidationMetadata,
  modulesMetadata,
  revalidateModule,
  revalidateApi,
  scoreFormat,
}: Readonly<ApiValidationProps<TApiIdentifier>>) {
  const { apiName, apiProtocol, score, rating, ratingDescription, result } = api;
  return (
    <Flex direction="column" gap="sm" maw="100%" py="sm" data-testid={`ApiValidation-${apiName}-${apiProtocol}`}>
      <ApiHeading
        name={apiName}
        protocol={apiProtocol}
        score={score}
        rating={rating}
        ratingDescription={ratingDescription}
        definitionPath={definitionPath}
        apiRevalidationMetadata={apiRevalidationMetadata}
        revalidateApi={revalidateApi}
        scoreFormat={scoreFormat}
      />

      <Validation
        api={api}
        result={result}
        metadata={{ apiName, apiProtocol }}
        rootPath={rootPath}
        modulesMetadata={modulesMetadata}
        definitionPath={definitionPath}
        revalidateModule={revalidateModule}
        scoreFormat={scoreFormat}
      />
    </Flex>
  );
}
