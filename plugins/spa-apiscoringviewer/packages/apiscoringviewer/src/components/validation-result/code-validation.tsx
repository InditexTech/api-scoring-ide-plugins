// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import EmptyIssues from "./empty-issues";
import ProtoValidation from "./proto-validation";
import SpectralValidation from "./spectral-validation";
import type { CodeIssue, ProtoIssue } from "../../types";

type CodeValidationProps = {
  basePath?: string;
  spectralIssues: CodeIssue[];
  protoIssues?: ProtoIssue[];
};

export default function CodeValidation({
  basePath,
  spectralIssues,
  protoIssues,
}: Readonly<CodeValidationProps>) {
  if (spectralIssues.length === 0 && protoIssues?.length === 0) {
    return <EmptyIssues />;
  }

  return (
    <>
      <SpectralValidation basePath={basePath} issues={spectralIssues} />

      {protoIssues && (
        <ProtoValidation basePath={basePath} issues={protoIssues} />
      )}
    </>
  );
}
