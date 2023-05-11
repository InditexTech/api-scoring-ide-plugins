import type { MantineTheme } from "@mantine/core";

const RATINGS = ["A+", "A", "B", "C", "D"];

export function getLabelColor(theme: MantineTheme, scoreLabel: string) {
  return theme.colors.scoring[RATINGS.indexOf(scoreLabel)];
}
