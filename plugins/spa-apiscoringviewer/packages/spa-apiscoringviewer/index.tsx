// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme, messages, CertificationPage, VSCodeDataProvider, FilesPage } from "../apiscoringviewer/src";
import Layout from "./src/components/layout";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <IntlProvider locale="en" messages={messages.en}>
        <Router basename={process.env.PUBLIC_URL}>
          <Layout>
            <Switch>
              <Route exact path="/" render={() => <CertificationPage DataProvider={VSCodeDataProvider} scoreFormat="percentage" />} />
              <Route path="/files" component={FilesPage} />
            </Switch>
          </Layout>
        </Router>
      </IntlProvider>
    </MantineProvider>
  </StrictMode>,
);
