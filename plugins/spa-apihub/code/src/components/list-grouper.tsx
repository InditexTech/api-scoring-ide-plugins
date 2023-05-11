import React, { ReactNode } from "react";
import { Box, Divider } from "@mantine/core";
import { CodeText } from "components/code-text";

export default function ListGrouper({ label }: { label: ReactNode }) {
  return (
    <>
      <Box>
        <CodeText data-testid="ListGrouper-label">{label}</CodeText>
      </Box>

      <Divider my="sm" />
    </>
  );
}
