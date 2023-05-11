import groupBy from "core-js-pure/actual/array/group-by";
import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import ListGrouper from "components/list-grouper";
import Issue from "./issue";
import type { CodeIssue } from "types";

type SpectralValidationProps = {
  basePath?: string;
  issues: CodeIssue[];
};

export default function SpectralValidation({ basePath, issues }: SpectralValidationProps) {
  const intl = useIntl();

  const issuesBySource = groupBy<CodeIssue>(
    issues,
    ({ source }) => source ?? intl.formatMessage({ id: "api.validation.unlocated-issue" }),
  );

  return (
    <>
      {Object.entries<CodeIssue[]>(issuesBySource).map(([source, issuesGroup]) => (
        <Fragment key={source}>
          <ListGrouper label={source} />

          {issuesGroup.map(({ code, message, range, severity }, i) => (
            <Issue
              key={`ValidationBlock-${source}-${code}-${range?.start?.line}-${range?.start?.character}-${range?.end?.line}-${range?.end?.character}-${i}`}
              message={message}
              code={code}
              severity={severity}
              startLine={range?.start?.line}
              startCharacter={range?.start?.character}
              endLine={range?.end?.line}
              endCharacter={range?.end?.character}
              filePath={[basePath, source].filter(Boolean).join("/")}
              data-testid={`Issue-${source}-${code}-${range?.start?.line}-${range?.start?.character}-${range?.end?.line}-${range?.end?.character}-${i}`}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
