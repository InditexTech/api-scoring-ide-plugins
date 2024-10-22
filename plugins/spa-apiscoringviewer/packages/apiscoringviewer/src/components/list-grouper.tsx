// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";
import { Box, Divider } from "@mantine/core";
import { CodeText } from "../components/code-text";

type ListGrouperProps = { label: ReactNode };

export default function ListGrouper({ label }: Readonly<ListGrouperProps>) {
  return (
    <>
      <Box>
        <CodeText data-testid="ListGrouper-label">{label}</CodeText>
      </Box>

      <Divider my="sm" />
    </>
  );
}
