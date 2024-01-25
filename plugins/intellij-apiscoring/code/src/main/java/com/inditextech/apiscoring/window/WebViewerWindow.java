// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.window;

import com.inditextech.apiscoring.handlers.MessageRouterHandler;

import com.inditextech.apiscoring.settings.ApiScoringSettingsState;
import com.intellij.notification.NotificationGroupManager;
import com.intellij.notification.NotificationType;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Computable;
import com.intellij.openapi.util.Disposer;
import com.intellij.psi.PsiFile;
import com.intellij.psi.search.FilenameIndex;
import com.intellij.psi.search.GlobalSearchScope;
import com.intellij.ui.jcef.JBCefBrowser;
import javax.swing.JComponent;
import org.cef.CefClient;
import org.cef.browser.CefMessageRouter;

public class WebViewerWindow {

  private final JComponent content;

  private final Project project;

  private final JBCefBrowser webview;

  public WebViewerWindow(Project project) {
    this.project = project;
    this.webview = this.buildWebview();
    this.content = this.webview.getComponent();
  }

  public JBCefBrowser buildWebview() {
    JBCefBrowser browser = new JBCefBrowser();
    CefClient cefClient = browser.getJBCefClient().getCefClient();
    browser.loadHTML(getHTML());
    Disposer.register(project, browser);

    if (!isApiProject(project)) {
      NotificationGroupManager.getInstance()
          .getNotificationGroup("APIScoring")
          .createNotification("Not an API project. Please make sure you have a metadata file.", NotificationType.ERROR)
          .notify(project);
    }

    CefMessageRouter msgRouter = CefMessageRouter.create();
    msgRouter.addHandler(new MessageRouterHandler(project), false);
    cefClient.addMessageRouter(msgRouter);
    return browser;
  }

  private boolean isApiProject(Project project) {
    return ApplicationManager.getApplication()
        .runReadAction((Computable<PsiFile[]>) () ->
            FilenameIndex.getFilesByName(project, "metadata.yml", GlobalSearchScope.allScope(project)))
        .length > 0;
  }

  public String getHTML() {
    final String frontendUrl = ApiScoringSettingsState.getInstance().getFrontendUrl();
    return "<html>\n" +
        "    <body style=\"margin: 0px; padding: 0px; overflow: hidden\">\n" +
        "        <div style=\"position: fixed; height: 100%; width: 100%\">\n" +
        "            <iframe\n" +
        "            id=\"iframe\"\n" +
        "            src=\"" + frontendUrl + "\"\n" +
        "            frameborder=\"0\"\n" +
        "            style=\"overflow: hidden; height: 100%; width: 100%\"\n" +
        "            height=\"100%\"\n" +
        "            width=\"100%\"\n" +
        "            ></iframe>\n" +
        "        </div>\n" +
        "        <script>\n" +

        "            const iframe = document.getElementById('iframe');\n" +
        "\n" +
        "            window.addEventListener('message', event => {\n" +
        "                console.log('message on webview.html', event.source == iframe.contentWindow, event.data);\n" +
        "                if(event.source == iframe.contentWindow) {\n" +
        "                    if(event.data.command === 'onProjectLoaded') {\n" +
        "                        onProjectLoaded();\n" +
        "                    }" +
        "                } else {\n" +
        "                    sendMessageToIframe(event.data);\n" +
        "                }\n" +
        "            });\n" +
        "\n" +
        "            let iframeLoaded = false;\n" +
        "            let iframeQueue = [];\n" +
        "            function sendMessageToIframe(message) {\n" +
        "                if(!iframeLoaded) {\n" +
        "                    console.log('iframe not ready yet, queueing message', message);\n" +
        "                    iframeQueue.push(message);\n" +
        "                } else {\n" +
        "                    iframe.contentWindow.postMessage(message, '*');\n" +
        "                }\n" +
        "            }\n" +
        "            const onProjectLoaded = () => {\n" +
        "                console.log('onProjectLoaded: sending queued messages', iframeQueue);\n" +
        "                iframeLoaded = true;\n" +
        "                iframeQueue.forEach(message => sendMessageToIframe(message));\n" +
        "                iframeQueue = [];\n" +
        "            };\n" +
        "        </script>\n" +
        "  </body>\n" +
        "</html>";
  }

  public JComponent getContent() {
    return content;
  }

  public void reload() {
    this.executeJavaScript("window.iframe.contentWindow.location.reload()");
    this.webview.loadHTML(getHTML());
  }

  public void executeJavaScript(String code) {
    this.webview.getCefBrowser().executeJavaScript(code, this.webview.getCefBrowser().getURL(), 0);
  }
}
