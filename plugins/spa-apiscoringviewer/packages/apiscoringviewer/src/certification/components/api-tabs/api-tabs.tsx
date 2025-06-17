// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import ApiValidation from "../api-validation";
import getModuleId from "../../utils/get-module-id";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSObject, Flex, MantineTheme, ScrollArea, Tabs, useMantineTheme } from "@mantine/core";
import { IconError404 } from "@tabler/icons-react";
import { getRatingLabelColor, getScoreLabelColor } from "../../../utils/get-label-color";
import Feedback from "../../../components/feedback";
import type {
  ApiIdentifier,
  Certification,
  CertificationPayload,
  GetApiIdentifier,
  ModulesMetadata,
  Rating,
  RevalidateModule,
  ScoreFormat,
} from "../../../types";

type ApiTabsProps<TApiIdentifier extends ApiIdentifier> = {
  certification: CertificationPayload<TApiIdentifier>;
  modulesMetadata: ModulesMetadata;
  apisRevalidationMetadata: ModulesMetadata;
  revalidateModule?: RevalidateModule;
  revalidateApi?: RevalidateModule;
  getApiIdentifier: GetApiIdentifier<TApiIdentifier>;
  scoreFormat: ScoreFormat;
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
  scoreFormat,
}: Readonly<ApiTabsProps<TApiIdentifier>>) {
  console.log("theme from hook", useMantineTheme());

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

  const getTabSx =
    ({ rating, score }: { rating: Rating | undefined; score: number }) =>
    (theme: MantineTheme): CSSObject => {
      console.log("theme", theme);
      if (scoreFormat === "rating" && rating) {
        return { "&[data-active]": { borderColor: getRatingLabelColor(theme, rating) } };
      }
      if (scoreFormat === "percentage" && typeof score === "number") {
        return {
          "&[data-active]": {
            borderColor: getScoreLabelColor(theme, selectedApi.score),
          },
        };
      }
      return {};
    };

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
          const { apiName, score, rating } = api;
          const id = getApiIdentifier(api);
          return (
            <Tabs.Tab key={id} value={id} data-testid={`ApiTab-${id}`} sx={getTabSx({ rating, score })}>
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
                    apisMetadata.find(({ name, apiSpecType }) => name === apiName && apiProtocol === apiSpecType)?.definitionPath ?? "";
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
                          scoreFormat={scoreFormat}
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
