// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import {
  CertificationPage,
  FilesPage,
  theme,
  messages,
} from "@inditextech/apiscoringviewer";
import Layout from "./src/components/layout";
import VscodeDataProvider from "./src/components/vscode-data-provider";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <IntlProvider locale="en" messages={messages.en}>
        <Router basename={process.env.PUBLIC_URL}>
          <Layout>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <CertificationPage DataProvider={VscodeDataProvider} />
                )}
              />
              <Route path="/files" component={FilesPage} />
            </Switch>
          </Layout>
        </Router>
      </IntlProvider>
    </MantineProvider>
  </StrictMode>
);
