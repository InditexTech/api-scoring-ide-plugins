import { Severity as SeverityEnum } from "../../types";
import { useMantineTheme } from "@mantine/core";
import { IconAlertTriangle, IconCircleX, IconInfoCircle } from "@tabler/icons-react";

type SeverityProps = {
  severity: SeverityEnum;
};

export default function SeverityIcon({ severity }: SeverityProps) {
  const theme = useMantineTheme();

  switch (severity) {
    case SeverityEnum.Error:
      return <IconCircleX color={theme.colors.red[5]} size={22} />;
    case SeverityEnum.Info:
      return <IconInfoCircle color={theme.colors.teal[5]} size={22} />;
    case SeverityEnum.Warning:
    default:
      return <IconAlertTriangle color={theme.colors.orange[5]} size={22} />;
  }
}
