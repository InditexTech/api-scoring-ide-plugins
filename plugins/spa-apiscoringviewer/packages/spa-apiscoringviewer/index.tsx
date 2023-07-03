import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { CertificationPage, FilesPage, theme } from "@inditextech/apiscoringviewer";
import messages from "./src/locales";
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
              <Route exact path="/" render={() => <CertificationPage DataProvider={VscodeDataProvider} />} />
              <Route path="/files" component={FilesPage} />
            </Switch>
          </Layout>
        </Router>
      </IntlProvider>
    </MantineProvider>
  </StrictMode>,
);
