// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiTabs from "./components/api-tabs";
import { useState, type ComponentType } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormattedMessage } from "react-intl";
import { Button, Center, Loader } from "@mantine/core";
import isIntelliJ from "../utils/is-intellij";
import Feedback from "../components/feedback";
import type { DataProviderChildFn } from "../types";

function ErrorFallback() {
  return (
    <Center w="100%">
      <FormattedMessage id="certification.unexpected-error" />
    </Center>
  );
}

type DataProviderType = ComponentType<{ children: DataProviderChildFn }>;
type CertificationProps = { DataProvider: DataProviderType };

export default function CertificationPage({
  DataProvider,
}: CertificationProps) {
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
        {({
          certification,
          loading,
          error,
          modulesMetadata,
          apisRevalidationMetadata,
          revalidateModule,
          revalidateApi,
        }) => {
          const showTriggerButton =
            !certification && !intelliJLoading && isIntelliJ();

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
                  certification={certification}
                  modulesMetadata={modulesMetadata}
                  apisRevalidationMetadata={apisRevalidationMetadata}
                  revalidateModule={revalidateModule}
                  revalidateApi={revalidateApi}
                />
              )}

              {(loading || intelliJLoading) && (
                <Center w="100%">
                  <Loader
                    color="gray"
                    size="lg"
                    data-testid="Certification-Loading"
                  />
                </Center>
              )}

              {error && (
                <Feedback.Error
                  fullHeight
                  mainText={
                    <FormattedMessage id="certification.network-error" />
                  }
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
