// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import openFile from "../../certification/utils/open-file";
import { MouseEvent, useCallback } from "react";
import { NavLink } from "@mantine/core";
import { CodeText } from "../../components/code-text";
import SeverityIcon from "../../components/validation-result/severity-icon";
import type { CodeIssue, CommonProps } from "../../types";

type IssueProps = {
  message?: string;
  severity: CodeIssue["severity"];
  code?: string;
  startLine?: number;
  startCharacter?: number;
  endLine?: number;
  endCharacter?: number;
  infoUrl?: string;
  filePath?: string;
} & CommonProps;

export default function Issue({
  message = "Unknown error",
  severity = 1,
  code,
  startLine,
  startCharacter,
  endLine,
  endCharacter,
  infoUrl,
  filePath,
  "data-testid": dataTestId = "Issue",
}: Readonly<IssueProps>) {
  let location = "";
  if (startLine) {
    location += startLine;
    if (startCharacter) {
      location += `:${startCharacter}`;
    }
  }

  const onItemClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (e.currentTarget.nodeName !== "A" && filePath) {
        openFile(filePath, {
          startLine,
          startCharacter,
          endLine,
          endCharacter,
        });
      }
    },
    [endCharacter, endLine, filePath, startCharacter, startLine]
  );

  return (
    <NavLink
      onClick={onItemClick}
      icon={<SeverityIcon severity={severity} />}
      label={
        <>
          {location && (
            <CodeText color="gray.7" mr="md">
              {location}
            </CodeText>
          )}

          <CodeText mr="md">
            {infoUrl ? (
              <a target="_blank" rel="noreferrer" href={infoUrl}>
                {message}
              </a>
            ) : (
              message
            )}
          </CodeText>

          <CodeText color="gray.7">{code}</CodeText>
        </>
      }
      my="xs"
      data-testid={dataTestId}
    />
  );
}
