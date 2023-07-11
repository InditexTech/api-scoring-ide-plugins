import ScoreLabel from "../score-label";
import type {
  ApiIdentifier,
  Certification,
  ModuleMetadata,
  ModuleValidation,
  PickRenameMulti,
  RevalidateModule,
} from "../../../types";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import {
  ActionIcon,
  Badge,
  Flex,
  Grid,
  MediaQuery,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import isIntelliJ from "../../../utils/is-intellij";
import isVsCode from "../../../utils/is-vscode";

type ApiHeadingProps = Pick<Certification, "rating" | "ratingDescription"> &
  PickRenameMulti<
    ApiIdentifier,
    { apiName: "name"; apiProtocol: "protocol" }
  > & {
    apiRevalidationMetadata: ModuleMetadata;
    revalidateApi?: RevalidateModule;
    definitionPath: string;
  };

export default function ApiHeading({
  name,
  protocol,
  rating,
  ratingDescription,
  apiRevalidationMetadata,
  revalidateApi,
  definitionPath,
}: ApiHeadingProps) {
  const onRevalidateApiClick = useCallback(() => {
    if (typeof revalidateApi === "function") {
      const payload: ModuleValidation = {
        apiName: name,
        apiSpecType: protocol,
        validationType: "OVERALL_SCORE",
        apiDefinitionPath: definitionPath,
      };

      revalidateApi(payload);

      if (isIntelliJ()) {
        window.cefQuery({
          request: JSON.stringify({
            request: "revalidateApi",
            ...payload,
          }),
        });
      }
    }
  }, [definitionPath, name, protocol, revalidateApi]);

  return (
    <Grid grow justify="space-between" align="center" mx={8}>
      <Grid.Col span={4}>
        <Flex gap="md" align="center">
          <div>
            <Flex data-testid="ApiHeading-Name">
              <Title
                lineClamp={1}
                order={2}
                sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {name}
              </Title>
            </Flex>

            <Flex gap="md">
              <Badge
                variant="filled"
                color="water.1"
                radius={0}
                data-testid={`ApiHeading-Badge-${name}-${protocol}`}
              >
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
                data-testid={`RevalidateApiButton-${name}`}
              >
                <IconPlayerPlay size={22} />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex>
      </Grid.Col>

      {rating && (
        <Grid.Col span="auto" data-testid="ApiHeading-CenterCol">
          <Flex justify="flex-end" gap="md">
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <span>
                <span>
                  {ratingDescription}

                  <br />

                  <FormattedMessage id="api.overall-score" />
                </span>
              </span>
            </MediaQuery>

            <ScoreLabel
              rating={rating}
              size="large"
              data-testid={`ApiHeading-Score-${name}-${protocol}`}
            />
          </Flex>
        </Grid.Col>
      )}
    </Grid>
  );
}
