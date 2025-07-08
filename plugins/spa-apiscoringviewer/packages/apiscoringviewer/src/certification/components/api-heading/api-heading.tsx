// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type {
  ApiIdentifier,
  Certification,
  ModuleMetadata,
  ModuleValidation,
  PickRenameMulti,
  RevalidateModule,
  ScoreFormat,
} from "../../../types";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { ActionIcon, Badge, Flex, Grid, MediaQuery, Title, Tooltip } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import isVsCode from "../../../utils/is-vscode";
import PercentageScoreLabel from "../score-label";
import RatingScoreLabel from "../score-label/rating-score-label";

type ApiHeadingProps = Pick<Certification, "score" | "rating" | "ratingDescription"> &
  PickRenameMulti<ApiIdentifier, { apiName: "name"; apiProtocol: "protocol" }> & {
    apiRevalidationMetadata: ModuleMetadata;
    revalidateApi?: RevalidateModule;
    definitionPath: string;
    scoreFormat: ScoreFormat;
  };

export default function ApiHeading({
  name,
  protocol,
  rating,
  score,
  ratingDescription,
  apiRevalidationMetadata,
  revalidateApi,
  definitionPath,
  scoreFormat,
}: Readonly<ApiHeadingProps>) {
  const onRevalidateApiClick = useCallback(() => {
    if (typeof revalidateApi === "function") {
      const payload: ModuleValidation = {
        apiName: name,
        apiSpecType: protocol,
        validationType: "OVERALL_SCORE",
        apiDefinitionPath: definitionPath,
      };

      revalidateApi(payload);
    }
  }, [definitionPath, name, protocol, revalidateApi]);

  const showScore = typeof score === "number" && rating;

  return (
    <Grid m={0} grow justify="space-between" align="center">
      <Grid.Col span={4}>
        <Flex gap="md" align="center">
          <div>
            <Flex data-testid="ApiHeading-Name">
              <Title lineClamp={1} order={2} sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                {name}
              </Title>
            </Flex>

            <Flex gap="md">
              <Badge variant="filled" color="water.1" radius={0} data-testid={`ApiHeading-Badge-${name}-${protocol}`}>
                <FormattedMessage id={`api.protocol.${protocol}`} />
              </Badge>
            </Flex>
          </div>

          {isVsCode() && (
            <Tooltip label={<FormattedMessage id="api.revalidate-api" />}>
              <ActionIcon
                variant="transparent"
                onClick={onRevalidateApiClick}
                loading={apiRevalidationMetadata.loading}
                disabled={apiRevalidationMetadata.loading}
                data-testid={`RevalidateApiButton-${name}`}
              >
                <IconPlayerPlay size={22} />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex>
      </Grid.Col>

      {showScore && (
        <Grid.Col span="auto" data-testid="ApiHeading-CenterCol">
          <Flex align="center" justify="flex-end" gap="md">
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <span>
                <span>
                  {ratingDescription}

                  <br />

                  <FormattedMessage id="api.overall-score" />
                </span>
              </span>
            </MediaQuery>

            {scoreFormat === "percentage" ? (
              <PercentageScoreLabel score={score} data-testid={`ApiHeading-Score-${name}-${protocol}`} />
            ) : (
              <RatingScoreLabel rating={rating} size="large" data-testid={`ApiHeading-RatingScore-${name}-${protocol}`} />
            )}
          </Flex>
        </Grid.Col>
      )}
    </Grid>
  );
}
