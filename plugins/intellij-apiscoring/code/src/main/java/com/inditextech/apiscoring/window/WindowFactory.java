package com.inditextech.apiscoring.window;

import com.inditextech.apiscoring.service.WebViewerWindowService;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.wm.ToolWindow;
import com.intellij.openapi.wm.ToolWindowFactory;
import org.jetbrains.annotations.NotNull;
import javax.swing.JComponent;

public class WindowFactory implements ToolWindowFactory {

    @Override
    public void createToolWindowContent(@NotNull Project project, @NotNull ToolWindow toolWindow) {
        WebViewerWindow webViewerWindow = project.getService(WebViewerWindowService.class).getWebViewerWindow();
        JComponent component = toolWindow.getComponent();
        component.getParent().add(webViewerWindow.getContent(), 0);
    }
}
