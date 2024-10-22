// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { groupBy } from "lodash";
import { Fragment, useMemo } from "react";
import ListGrouper from "../list-grouper";
import EmptyIssues from "./empty-issues";
import Issue from "./issue";
import type { DocIssue } from "../../types";

type DocValidationProps = {
  basePath: string;
  issues: DocIssue[];
};

export default function DocValidation({
  basePath,
  issues,
}: Readonly<DocValidationProps>) {
  const issuesByFileName = useMemo(
    () =>
      groupBy<DocIssue>(
        issues,
        ({ fileName }) => fileName ?? "Unlocated issue"
      ),
    [issues]
  );

  if (issues.length === 0) {
    return <EmptyIssues />;
  }

  return (
    <>
      {Object.entries<DocIssue[]>(issuesByFileName).map(
        ([fileName, issuesGroup]) => (
          <Fragment key={fileName}>
            <ListGrouper label={fileName} />

            {issuesGroup.map(
              (
                {
                  lineNumber,
                  ruleNames,
                  ruleDescription,
                  ruleInformation,
                  errorRange,
                  severity,
                },
                i
              ) => (
                <Issue
                  key={`doc-warning-${i}`}
                  message={ruleDescription}
                  code={ruleNames?.join(", ")}
                  severity={severity}
                  startLine={lineNumber}
                  startCharacter={errorRange?.[0]}
                  filePath={`${basePath}/${fileName}`}
                  infoUrl={ruleInformation}
                  data-testid={`Issue-${fileName}-${lineNumber}-${ruleNames?.join(
                    "-"
                  )}`}
                />
              )
            )}
          </Fragment>
        )
      )}
    </>
  );
}
