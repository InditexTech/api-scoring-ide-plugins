// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.listeners;

import com.inditextech.apiscoring.service.WebViewerWindowService;
import com.inditextech.apiscoring.window.WebViewerWindow;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.wm.ToolWindowManager;
import com.intellij.openapi.wm.ex.ToolWindowManagerListener;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

public class WebViewerWindowListener implements ToolWindowManagerListener {

    private final Project project;

    public WebViewerWindowListener(Project project) {
        this.project = project;
    }

    @Override
    public void stateChanged(@NotNull ToolWindowManager toolWindowManager) {
        ToolWindowManagerListener.super.stateChanged(toolWindowManager);
        if("APIScoring".equals(toolWindowManager.getActiveToolWindowId())){
            WebViewerWindow webViewerWindow = project.getService(WebViewerWindowService.class).getWebViewerWindow();
            if(!Objects.requireNonNull(toolWindowManager.getToolWindow("APIScoring")).isActive()){
                webViewerWindow.reload();
            }
        }
    }
}
