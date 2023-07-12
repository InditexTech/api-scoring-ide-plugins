// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import CertificationPage from "features/certification/certification-page";
import FilesPage from "features/files/files-page";
import { messages } from "modules";
import { theme } from "theme";
import React, { type ElementType } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import isVSCode from "utils/is-vscode";
import Layout from "components/layout";

export default function App({ Router = BrowserRouter }: { Router?: ElementType }) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <IntlProvider locale="en" messages={messages.en}>
        <Router basename={process.env.PUBLIC_URL}>
          <Layout>
            <Switch>
              {isVSCode() ? (
                <>
                  <Route exact path="/" component={CertificationPage} />
                  <Route path="/files" component={FilesPage} />
                </>
              ) : (
                <Route exact path="/protocols/:protocol/apis/:api" component={CertificationPage} />
              )}
            </Switch>
          </Layout>
        </Router>
      </IntlProvider>
    </MantineProvider>
  );
}
