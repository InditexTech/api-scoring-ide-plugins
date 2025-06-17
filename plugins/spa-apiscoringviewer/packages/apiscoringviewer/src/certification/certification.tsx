// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiTabs from "./components/api-tabs";
import { useState, type ComponentType } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormattedMessage } from "react-intl";
import { Button, Center, Loader } from "@mantine/core";
import isIntelliJ from "../utils/is-intellij";
import defaultGetApiIdentifier from "./utils/get-api-identifier";
import Feedback from "../components/feedback";
import type { ApiIdentifier, DataProviderChildFn, GetApiIdentifier, ScoreFormat } from "../types";

function ErrorFallback() {
  return (
    <Center w="100%">
      <FormattedMessage id="certification.unexpected-error" />
    </Center>
  );
}

type DataProviderType<TApiIdentifier extends ApiIdentifier> = ComponentType<{
  children: DataProviderChildFn<TApiIdentifier>;
}>;

type CertificationProps<TApiIdentifier extends ApiIdentifier> = {
  DataProvider: DataProviderType<TApiIdentifier>;
  getApiIdentifier?: GetApiIdentifier<TApiIdentifier>;
  /**
   * Determines how the score is displayed.
   * Possible values:
   * - "rating": Displays the score as a letter grade (A+ to D).
   * - "percentage": Displays the score as a numeric percentage (0 to 100).
   */
  scoreFormat?: ScoreFormat;
};

export default function CertificationPage<TApiIdentifier extends ApiIdentifier = ApiIdentifier>({
  DataProvider,
  getApiIdentifier = defaultGetApiIdentifier,
  scoreFormat = "rating",
}: Readonly<CertificationProps<TApiIdentifier>>) {
  const [intelliJLoading, setIntelliJLoading] = useState(false);

  function onClick() {
    window.cefQuery({
      request: JSON.stringify({
        request: "submitCertificationIntelliJ",
      }),
    });
    setIntelliJLoading(true);
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DataProvider>
        {({ certification, loading, error, modulesMetadata, apisRevalidationMetadata, revalidateModule, revalidateApi }) => {
          const showTriggerButton = !certification && !intelliJLoading && isIntelliJ();

          return (
            <>
              {showTriggerButton && (
                <Center w="100%">
                  <Button onClick={onClick} color="dark">
                    Trigger Certification
                  </Button>
                </Center>
              )}

              {certification && (
                <ApiTabs
                  getApiIdentifier={getApiIdentifier}
                  certification={certification}
                  modulesMetadata={modulesMetadata}
                  apisRevalidationMetadata={apisRevalidationMetadata}
                  revalidateModule={revalidateModule}
                  revalidateApi={revalidateApi}
                  scoreFormat={scoreFormat}
                />
              )}

              {(loading || intelliJLoading) && (
                <Center w="100%">
                  <Loader color="gray" size="lg" data-testid="Certification-Loading" />
                </Center>
              )}

              {error && (
                <Feedback.Error
                  fullHeight
                  mainText={<FormattedMessage id="certification.network-error" />}
                  data-testid="CertificationPage-NetworkError"
                />
              )}
            </>
          );
        }}
      </DataProvider>
    </ErrorBoundary>
  );
}
