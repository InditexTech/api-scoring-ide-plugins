package com.inditex.intelhub.service;

import com.inditex.intelhub.window.WebViewerWindow;
import com.intellij.openapi.project.Project;

public final class WebViewerWindowService {

    private final WebViewerWindow webViewerWindow;

    public WebViewerWindowService(Project project) {
        webViewerWindow = new WebViewerWindow(project);
    }

    public WebViewerWindow getWebViewerWindow() {
        return webViewerWindow;
    }
}
