import ApiValidation from "features/certification/components/api-validation/api-validation";
import getModuleId from "features/certification/utils/get-module-id";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { Flex, ScrollArea, Tabs } from "@mantine/core";
import { IconError404 } from "@tabler/icons";
import { getLabelColor } from "utils/get-label-color";
import Feedback from "components/feedback";
import type { ApiIdentifier, CertificationPayload, ModulesMetadata, RevalidateModule } from "types";

export default function ApiTabs({
  certification: {
    metadata: { apis: apisMetadata },
    results: apis,
    rootPath,
  },
  modulesMetadata,
  apisRevalidationMetadata,
  revalidateModule,
  revalidateApi,
}: {
  certification: CertificationPayload;
  modulesMetadata: ModulesMetadata;
  apisRevalidationMetadata: ModulesMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(apis.length > 0 ? getApiId(apis[0]) : null);
  const selectedApi = apis.find(({ apiName, apiProtocol }) => getApiId({ apiName, apiProtocol }) === selectedId);

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
      sx={{ flex: 1, flexDirection: "column", flexWrap: "nowrap" }}
    >
      <Tabs.List>
        {apis.map(({ apiName, apiProtocol, rating }) => {
          const id = getApiId({ apiName, apiProtocol });
          return (
            <Tabs.Tab
              key={id}
              value={id}
              data-testid={`ApiTab-${id}`}
              sx={
                rating
                  ? (theme) => ({
                    "&[data-active]": { borderColor: getLabelColor(theme, rating) },
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
          {({ height }) => {
            return <>{
              apis.map((api) => {
                const { apiName, apiProtocol } = api;
                const tabId = getApiId({ apiName, apiProtocol });
                const definitionPath =
                  apisMetadata.find(({ name, apiSpecType }) => name === apiName && apiProtocol === apiSpecType)
                    ?.definitionPath ?? "";
                const moduleMetadata = modulesMetadata[getModuleId(api)] ?? { loading: false };
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
              })
            }
            </>
          }}
        </AutoSizer>
      </Flex>
    </Tabs>
  );
}

function getApiId({ apiName, apiProtocol }: ApiIdentifier) {
  return `${apiName}-${apiProtocol}`;
}
