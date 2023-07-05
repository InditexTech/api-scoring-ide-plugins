import { FormattedMessage } from "react-intl";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import isVsCode from "../../../utils/is-vscode";
import type {
  Certification,
  RevalidateModule,
  ValidationType,
} from "../../../types";

type RevalidateModuleActionProps = {
  metadata: Pick<Certification, "apiName" | "apiProtocol">;
  validationType: ValidationType;
  definitionPath: string;
  revalidateModule?: RevalidateModule;
  loading: boolean;
};

export default function RevalidateModuleAction({
  metadata: { apiName, apiProtocol },
  validationType,
  definitionPath,
  revalidateModule,
  loading,
}: RevalidateModuleActionProps) {
  const onRevalidateClick = () => {
    if (typeof revalidateModule === "function") {
      revalidateModule({
        apiName,
        apiSpecType: apiProtocol,
        validationType,
        apiDefinitionPath: definitionPath,
      });

      window.cefQuery({
        request: JSON.stringify({
          request: "revalidateModule",
          apiName,
          apiSpecType: apiProtocol,
          validationType,
          definitionPath,
        }),
      });
    }
  };

  if (!isVsCode()) {
    return null;
  }

  return (
    <Tooltip
      label={
        <FormattedMessage
          id="api.revalidate-module"
          values={{ name: validationType }}
        />
      }
    >
      <ActionIcon
        onClick={onRevalidateClick}
        loading={loading}
        size="md"
        mr="sm"
        data-testid={`RevalidateButton-${apiName}-${validationType}`}
      >
        <IconPlayerPlay />
      </ActionIcon>
    </Tooltip>
  );
}
