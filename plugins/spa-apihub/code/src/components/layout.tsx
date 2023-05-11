import React from "react";
import { Flex } from "@mantine/core";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <Flex h="100vh">{children}</Flex>;
}
