package com.inditextech.intelhub.listeners;

import com.inditextech.intelhub.service.WebViewerWindowService;
import com.inditextech.intelhub.window.WebViewerWindow;
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
