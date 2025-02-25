// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { Fragment, useMemo } from "react";
import { groupBy } from "lodash";
import ListGrouper from "../../components/list-grouper";
import Issue from "./issue";
import type { ProtoIssue } from "../../types";

type ProtoValidationProps = {
  basePath?: string;
  issues: ProtoIssue[];
};

export default function ProtoValidation({
  basePath,
  issues,
}: Readonly<ProtoValidationProps>) {
  const issuesByFileName = useMemo(
    () =>
      groupBy<ProtoIssue>(
        issues,
        ({ fileName }) => fileName ?? "Unlocated issue"
      ),
    [issues]
  );

  return (
    <>
      {Object.entries<ProtoIssue[]>(issuesByFileName).map(
        ([fileName, issuesGroup]) => (
          <Fragment key={fileName}>
            <ListGrouper label={fileName} />

            {issuesGroup.map(({ rule, line, message, column, severity }, i) => (
              <Issue
                key={`ProtoValidation-${fileName}-${rule}-${line}-${column}-${i}`}
                message={message}
                code={rule}
                severity={severity}
                startLine={line}
                startCharacter={column}
                filePath={`${basePath}/${fileName}`}
                data-testid={`ProtoValidation-${fileName}-${rule}-${line}-${column}-${i}`}
              />
            ))}
          </Fragment>
        )
      )}
    </>
  );
}
