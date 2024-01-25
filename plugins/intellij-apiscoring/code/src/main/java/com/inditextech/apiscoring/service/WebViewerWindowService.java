// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.service;

import com.inditextech.apiscoring.window.WebViewerWindow;
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
