// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import isCodeValidation from "../../utils/is-code-validation";
import isDocValidation from "../../utils/is-doc-validation";
import CodeValidation from "../../components/validation-result/code-validation";
import DocValidation from "../../components/validation-result/doc-validation";
import type { ApiIdentifier, CertificationPayload, ValidationType, ValidationTypes } from "../../types";

type ValidationResultProps<TApiIdentifier extends ApiIdentifier> = {
  validationType: ValidationType;
  rootPath: CertificationPayload<TApiIdentifier>["rootPath"];
  definitionPath: string;
  validation: ValidationTypes;
};

export default function ValidationResult<TApiIdentifier extends ApiIdentifier>({
  validationType,
  validation,
  rootPath,
  definitionPath,
}: Readonly<ValidationResultProps<TApiIdentifier>>) {
  return (
    <div data-testid={`ValidationResult-${validationType}`}>
      {/* Linter and Security validations */}
      {isCodeValidation(validationType) && (
        <CodeValidation
          basePath={[rootPath, definitionPath].join("/")}
          spectralIssues={validation.spectralValidation?.issues ?? []}
          protoIssues={validation.protolintValidation?.issues ?? []}
        />
      )}

      {/* Documentation validations */}
      {isDocValidation(validationType) && <DocValidation basePath={rootPath ?? ""} issues={validation.issues ?? []} />}
    </div>
  );
}
