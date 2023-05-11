import { render, screen } from "@testing-library/react";
import ApiTabs from "features/certification/components/api-tabs";
import React from "react";
import { CERTS_PAYLOAD, Providers } from "utils/test-utils";

test("shows empty apis message", async () => {
  const certification = { ...CERTS_PAYLOAD, results: [] };

  render(<ApiTabs certification={certification} modulesMetadata={{}} apisRevalidationMetadata={{}} />, {
    wrapper: Providers,
  });

  expect(screen.getByTestId("ApiTabs-FeedbackStateNoApis")).toBeInTheDocument();
  expect(screen.queryByTestId("ApiTabs")).not.toBeInTheDocument();
});
