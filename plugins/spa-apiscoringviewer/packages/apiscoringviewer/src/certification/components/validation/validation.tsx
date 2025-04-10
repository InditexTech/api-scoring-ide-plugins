// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import { Accordion, MantineTheme } from "@mantine/core";
import isCodeValidation from "../../../utils/is-code-validation";
import isDocValidation from "../../../utils/is-doc-validation";
import ValidationResult from "../../../components/validation-result";
import { AccordionControl } from "./accordion-control";
import RevalidateModuleAction from "./revalidate-module-action";
import type {
  ApiIdentifier,
  Certification,
  CertificationPayload,
  ModuleMetadata,
  RevalidateModule,
  ValidationTypes,
} from "../../../types";

type ValidationProps<TApiIdentifier extends ApiIdentifier> = {
  result: Certification["result"];
  metadata: Pick<Certification, "apiName" | "apiProtocol">;
  rootPath: CertificationPayload<TApiIdentifier>["rootPath"];
  definitionPath: string;
  moduleMetadata: ModuleMetadata;
  revalidateModule?: RevalidateModule;
};

export default function Validation<TApiIdentifier extends ApiIdentifier>({
  result,
  metadata,
  rootPath = "",
  definitionPath,
  moduleMetadata,
  revalidateModule,
}: Readonly<ValidationProps<TApiIdentifier>>) {
  const [collapsed, setCollapsed] = useState<string[]>(() => getOpenedAccordions(result));

  useEffect(() => {
    setCollapsed(getOpenedAccordions(result));
  }, [result]);

  return (
    <Accordion
      chevronPosition="right"
      variant="separated"
      multiple
      value={collapsed}
      onChange={setCollapsed}
      py="md"
      styles={getAccordionStyles}
    >
      {result.map((validations) => {
        const validationValues = Object.values(validations) as ValidationTypes[];
        if (validationValues.length === 0) {
          return null;
        }
        const [validation] = validationValues;
        const { validationType, score } = validation;

        return (
          <Accordion.Item value={`accordion-${validationType}`} key={`accordion-${validationType}`}>
            <AccordionControl
              score={score}
              validationType={validationType}
              action={
                <RevalidateModuleAction
                  metadata={metadata}
                  definitionPath={definitionPath}
                  validationType={validationType}
                  revalidateModule={revalidateModule}
                  loading={moduleMetadata.loading}
                />
              }
            />

            <Accordion.Panel bg="dark.7" mx="md" mb="md" pt="sm">
              <ValidationResult
                validationType={validationType}
                rootPath={rootPath}
                validation={validation}
                definitionPath={definitionPath}
              />
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

function getOpenedAccordions<TApiIdentifier extends ApiIdentifier>(result: ValidationProps<TApiIdentifier>["result"]) {
  const accordions = [];
  for (const validations of result) {
    const validationValues = Object.values(validations) as ValidationTypes[];
    if (validationValues.length === 0) {
      continue;
    }

    const [validation] = validationValues;
    const { validationType } = validation;
    let hasIssues = false;
    if (isCodeValidation(validationType)) {
      const spectralIssues = validation.spectralValidation?.issues ?? [];
      const protoIssues = validation.protolintValidation?.issues ?? [];
      const issues = spectralIssues.concat(protoIssues);
      hasIssues = issues.length > 0;
    } else if (isDocValidation(validationType)) {
      hasIssues = validation.issues.length > 0;
    }

    if (hasIssues) {
      accordions.push(`accordion-${validationType}`);
    }
  }

  return accordions;
}

function getAccordionStyles(theme: MantineTheme) {
  return {
    item: {
      backgroundColor: theme.colors.dark[4],

      "&[data-active]": {
        backgroundColor: theme.colors.dark[4],
      },
    },
  };
}
