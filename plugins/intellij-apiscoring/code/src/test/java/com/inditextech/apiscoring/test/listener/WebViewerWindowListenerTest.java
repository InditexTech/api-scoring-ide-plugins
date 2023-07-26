package com.inditextech.apiscoring.test.listener;

import com.inditextech.apiscoring.listeners.WebViewerWindowListener;
import com.inditextech.apiscoring.service.WebViewerWindowService;
import com.inditextech.apiscoring.window.WebViewerWindow;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.project.ex.ProjectEx;
import com.intellij.openapi.wm.ToolWindow;
import com.intellij.openapi.wm.ToolWindowManager;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.*;

public class WebViewerWindowListenerTest {

    private Project project;
    private ToolWindowManager toolWindowManager;
    private WebViewerWindowListener webViewerWindowListener;
    private WebViewerWindowService webViewerWindowService;
    private WebViewerWindow webViewerWindow;
    private ToolWindow toolWindow;

    @Before
    public void setUp() {
        project = mock(ProjectEx.class);
        toolWindowManager = mock(ToolWindowManager.class);
        webViewerWindowListener = new WebViewerWindowListener(project);
        webViewerWindowService = mock(WebViewerWindowService.class);
        webViewerWindow = mock(WebViewerWindow.class);
        toolWindow = mock(ToolWindow.class);
    }

    @Test
    public void should_reload_webview_when_tool_window_is_not_active() {
        when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
        when(toolWindowManager.getActiveToolWindowId()).thenReturn("APIScoring");
        when(toolWindowManager.getToolWindow("APIScoring")).thenReturn(toolWindow);
        when(toolWindow.isActive()).thenReturn(Boolean.FALSE);
        when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);
        doNothing().when(webViewerWindow).reload();

        webViewerWindowListener.stateChanged(toolWindowManager);

        verify(webViewerWindow).reload();
    }

    @Test
    public void should_not_reload_webview_when_tool_window_is_active() {

        when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
        when(toolWindowManager.getActiveToolWindowId()).thenReturn("APIScoring");
        when(toolWindowManager.getToolWindow("APIScoring")).thenReturn(toolWindow);
        when(toolWindow.isActive()).thenReturn(Boolean.TRUE);
        when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);

        webViewerWindowListener.stateChanged(toolWindowManager);

        verify(webViewerWindow, times(0)).reload();
    }
}
