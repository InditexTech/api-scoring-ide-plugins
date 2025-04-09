// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiValidation from "../api-validation";
import getModuleId from "../../utils/get-module-id";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { Flex, ScrollArea, Tabs } from "@mantine/core";
import { IconError404 } from "@tabler/icons-react";
import { getLabelColor } from "../../../utils/get-label-color";
import Feedback from "../../../components/feedback";
import type {
  ApiIdentifier,
  CertificationPayload,
  GetApiIdentifier,
  ModulesMetadata,
  RevalidateModule,
} from "../../../types";

type ApiTabsProps<TApiIdentifier extends ApiIdentifier> = {
  certification: CertificationPayload<TApiIdentifier>;
  modulesMetadata: ModulesMetadata;
  apisRevalidationMetadata: ModulesMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
  getApiIdentifier: GetApiIdentifier<TApiIdentifier>;
};

export default function ApiTabs<TApiIdentifier extends ApiIdentifier = ApiIdentifier>({
  certification: {
    metadata: { apis: apisMetadata },
    results: apis,
    rootPath,
  },
  modulesMetadata,
  apisRevalidationMetadata,
  revalidateModule,
  revalidateApi,
  getApiIdentifier,
}: Readonly<ApiTabsProps<TApiIdentifier>>) {
  const [selectedId, setSelectedId] = useState<string | null>(apis.length > 0 ? getApiIdentifier(apis[0]) : null);
  const selectedApi = apis.find((api) => getApiIdentifier(api) === selectedId);

  if (!selectedApi || apis.length === 0) {
    return (
      <Feedback
        mainText={<FormattedMessage id="certification.api-not-found" />}
        Icon={IconError404}
        data-testid="ApiTabs-FeedbackStateNoApis"
        fullHeight
      />
    );
  }

  return (
    <Tabs
      value={selectedId}
      onTabChange={setSelectedId}
      data-testid="ApiTabs"
      display="flex"
      sx={{
        flex: 1,
        flexDirection: "column",
        flexWrap: "nowrap",
        height: "100%",
      }}
    >
      <Tabs.List>
        {apis.map((api) => {
          const { apiName, score } = api;
          const id = getApiIdentifier(api);
          return (
            <Tabs.Tab
              key={id}
              value={id}
              data-testid={`ApiTab-${id}`}
              sx={
                typeof score === "number"
                  ? (theme) => ({
                      "&[data-active]": {
                        borderColor: getLabelColor(theme, score),
                      },
                    })
                  : {}
              }
            >
              {apiName}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>

      <Flex h="100%">
        <AutoSizer disableWidth style={{ width: "100%" }}>
          {({ height }: { height: number }) => {
            return (
              <>
                {apis.map((api) => {
                  const { apiName, apiProtocol } = api;
                  const tabId = getApiIdentifier(api);
                  const definitionPath =
                    apisMetadata.find(({ name, apiSpecType }) => name === apiName && apiProtocol === apiSpecType)
                      ?.definitionPath ?? "";
                  const moduleMetadata = modulesMetadata[getModuleId(api)] ?? {
                    loading: false,
                  };
                  const apiRevalidationMetadata = apisRevalidationMetadata[apiName] ?? { loading: false };
                  return (
                    <Tabs.Panel key={tabId} value={tabId} w="100%">
                      <ScrollArea sx={{ height }}>
                        <ApiValidation
                          api={api}
                          rootPath={rootPath}
                          definitionPath={definitionPath}
                          moduleMetadata={moduleMetadata}
                          apiRevalidationMetadata={apiRevalidationMetadata}
                          revalidateModule={revalidateModule}
                          revalidateApi={revalidateApi}
                        />
                      </ScrollArea>
                    </Tabs.Panel>
                  );
                })}
              </>
            );
          }}
        </AutoSizer>
      </Flex>
    </Tabs>
  );
}
