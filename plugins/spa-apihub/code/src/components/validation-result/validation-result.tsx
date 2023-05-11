import React from "react";
import isCodeValidation from "utils/is-code-validation";
import isDocValidation from "utils/is-doc-validation";
import CodeValidation from "components/validation-result/code-validation";
import DocValidation from "components/validation-result/doc-validation";
import type { CertificationPayload, ValidationType, ValidationTypes } from "types";

type ValidationResultProps = {
  validationType: ValidationType;
  rootPath: CertificationPayload["rootPath"];
  definitionPath: string;
  validation: ValidationTypes;
};

export default function ValidationResult({
  validationType,
  validation,
  rootPath,
  definitionPath,
}: ValidationResultProps) {
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
