// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useReducer, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  ActionIcon,
  Container,
  FileInput,
  Grid,
  Loader,
  Select,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlayerPlay, IconUpload } from "@tabler/icons-react";
import { sendMessageVscode } from "../../../utils/send-message-vscode";
import useEventHandler from "../../../hooks/use-event-handler";
import Feedback from "../../../components/feedback";
import CodeValidation from "../../../components/validation-result/code-validation";
import type {
  CodeIssue,
  SetFileResults,
  SetFileResultsError,
} from "../../../types";

// There is a bug in the latest @matine/core lib that does not include the type for
// the placeholder prop. This is a workaround to add the type to the InputSharedProps
// interface and it could be remove once we upgrade at least to version 7.4.0
// See https://github.com/mantinedev/mantine/issues/5401
declare module "@mantine/core" {
  interface InputSharedProps {
    placeholder?: string | undefined;
  }
}

const protocolOptions = [
  { label: "REST", value: "rest" },
  { label: "gRPC", value: "grpc" },
  { label: "AsyncAPI", value: "asyncapi" },
];

type FormType = {
  file: string | File | null;
  apiProtocol: (typeof protocolOptions)[number]["value"];
};

type FileAction =
  | { type: "loading"; payload?: boolean }
  | { type: "success"; payload: SetFileResults["payload"] }
  | { type: "error"; payload: SetFileResultsError["payload"] };

type FileResultsState = {
  loading: boolean;
  fileResults: SetFileResults["payload"] | null;
  error: SetFileResultsError["payload"] | null;
};

function reducer(state: FileResultsState, { type, payload }: FileAction) {
  switch (type) {
    case "loading":
      return { ...state, fileResults: null, loading: true, error: null };
    case "success":
      return { ...state, fileResults: payload, loading: false, error: null };
    case "error":
      return { ...state, fileResults: null, loading: false, error: payload };
  }
}

export default function FilesForm() {
  const form = useForm<FormType>({
    initialValues: { file: "", apiProtocol: protocolOptions[0].value },
  });
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [{ fileResults, loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    fileResults: null,
    error: null,
  });

  useEventHandler<SetFileResults["payload"]>(
    "setFileResults",
    useCallback((payload) => {
      dispatch({ type: "success", payload });
    }, [])
  );

  useEventHandler<SetFileResultsError["payload"]>(
    "setFileResultsError",
    useCallback((payload) => {
      dispatch({ type: "error", payload });
    }, [])
  );

  function onSubmit({ file, ...restValues }: NonNullable<FormType>) {
    dispatch({ type: "loading" });

    if (typeof file !== "string" && file instanceof File) {
      const { path: filePath } = file;
      setSelectedFilePath(filePath);
      sendMessageVscode("onClickValidateFile", {
        filePath: filePath,
        ...restValues,
      });
    }
  }

  return (
    <Container p="lg">
      <form data-testid="FilesForm" onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Grid align="end">
            <Grid.Col xs={12} sm={6} md="auto">
              <FileInput
                withAsterisk
                required
                color="dark"
                icon={<IconUpload size={14} />}
                accept=".yml,.json,.proto"
                label="Select file:"
                placeholder="Select file"
                size="md"
                wrapperProps={{ "data-testid": "File" }}
                {...form.getInputProps("file")}
              />
            </Grid.Col>

            <Grid.Col span="auto">
              <Select
                required
                label={<FormattedMessage id="file-form.step.protocol" />}
                color="dark"
                data={protocolOptions}
                size="md"
                {...form.getInputProps("apiProtocol")}
              />
            </Grid.Col>

            <Grid.Col span="content">
              <ActionIcon
                type="submit"
                variant="filled"
                size="xl"
                aria-label="submit"
              >
                <IconPlayerPlay />
              </ActionIcon>
            </Grid.Col>
          </Grid>

          {error && (
            <Feedback.Error
              mainText="Error loading file validation"
              data-testid="FilesForm-ValidationError"
            />
          )}

          {loading && <Loader size={22} data-testid="FilesPage-Loader" />}

          {!loading && fileResults?.results && (
            <output>
              <CodeValidation
                spectralIssues={patchSourceFile(
                  fileResults.results,
                  selectedFilePath
                )}
                protoIssues={[]}
              />
            </output>
          )}
        </Stack>
      </form>
    </Container>
  );
}

function patchSourceFile(results: CodeIssue[], path: string) {
  return results.map((codeIssue) => ({ ...codeIssue, source: path }));
}
