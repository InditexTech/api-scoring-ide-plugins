import { render, screen } from "@testing-library/react";
import Validation from "features/certification/components/validation";
import React from "react";
import { Providers } from "utils/test-utils";
import type { Certification } from "types";

test("skips empty validations", async () => {
  const validations = [{}] as Certification["result"];

  render(
    <Validation
      result={validations}
      metadata={{ apiName: "API Sample", apiProtocol: 1 }}
      rootPath="rootPath"
      definitionPath="definitionPath"
      moduleMetadata={{ loading: false }}
    />,
    { wrapper: Providers },
  );
});
