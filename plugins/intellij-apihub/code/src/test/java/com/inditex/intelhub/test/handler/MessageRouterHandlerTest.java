package com.inditex.intelhub.test.handler;

import com.inditex.intelhub.handlers.MessageRouterHandler;
import com.inditex.intelhub.service.CertificationService;
import com.inditex.intelhub.service.WebViewerWindowService;
import com.inditex.intelhub.test.TestUtils;
import com.inditex.intelhub.utils.FileUtils;
import com.inditex.intelhub.window.WebViewerWindow;
import com.intellij.ide.projectView.ProjectView;
import com.intellij.ide.projectView.impl.ProjectViewImpl;
import com.intellij.ide.projectView.impl.ProjectViewPane;
import com.intellij.notification.Notification;
import com.intellij.notification.NotificationGroup;
import com.intellij.notification.NotificationGroupManager;
import com.intellij.notification.NotificationType;
import com.intellij.notification.impl.NotificationGroupManagerImpl;
import com.intellij.openapi.application.Application;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.project.ex.ProjectEx;
import com.intellij.openapi.util.Computable;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.PsiFile;
import org.cef.browser.CefBrowser;
import org.cef.browser.CefFrame;
import org.cef.callback.CefQueryCallback;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.MockedStatic;
import org.mockito.stubbing.Answer;

import java.util.List;

import static org.mockito.Mockito.*;

public class MessageRouterHandlerTest {

    private MessageRouterHandler messageRouterHandler;
    private ProjectViewImpl projectViewImplMock;
    private Application application;
    private Project project;
    private WebViewerWindowService webViewerWindowService;
    private WebViewerWindow webViewerWindow;
    private ProjectViewPane projectViewPane;
    private CertificationService certificationService;

    @Before
    public void setUp() {
        projectViewImplMock = mock(ProjectViewImpl.class);
        application = mock(Application.class);
        project = mock(ProjectEx.class);
        webViewerWindowService = mock(WebViewerWindowService.class);
        webViewerWindow = mock(WebViewerWindow.class);
        projectViewPane = mock(ProjectViewPane.class);
        certificationService = mock(CertificationService.class);
        messageRouterHandler = new MessageRouterHandler(project);
    }

    @Test
    public void should_validate_api() {
        try (MockedStatic<ProjectView> projectViewMock = mockStatic(ProjectView.class);
             MockedStatic<ApplicationManager> appManager = mockStatic(ApplicationManager.class)) {

            when(project.getService(CertificationService.class)).thenReturn(certificationService);
            projectViewMock.when(() -> ProjectView.getInstance(project)).thenReturn(projectViewImplMock);
            when(projectViewImplMock.getCurrentProjectViewPane()).thenReturn(projectViewPane);
            when(projectViewPane.getSelectedElement()).thenReturn(null);
            appManager.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.runReadAction(ArgumentMatchers.<Computable<PsiFile[]>>any())).thenReturn(new PsiFile[]{});
            when(certificationService.getCertificationResults(any(), any(), any())).thenReturn(TestUtils.getSetCertificationResultDTO());
            when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
            when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);
            doNothing().when(webViewerWindow).executeJavaScript(any());

            messageRouterHandler.onQuery(mock(CefBrowser.class), mock(CefFrame.class), 1L, "{\"request\":\"submitCertificationIntelliJ\"}",
                    Boolean.FALSE, mock(CefQueryCallback.class));

            verify(webViewerWindow).executeJavaScript(any());
        }
    }

    @Test
    public void should_show_message_when_it_is_not_an_api_folder() {

        try (MockedStatic<ProjectView> projectViewMock = mockStatic(ProjectView.class);
             MockedStatic<ApplicationManager> appManager = mockStatic(ApplicationManager.class);
             MockedStatic<NotificationGroupManager> notificationGroupManager = mockStatic(NotificationGroupManager.class)) {

            when(project.getService(CertificationService.class)).thenReturn(certificationService);
            projectViewMock.when(() -> ProjectView.getInstance(project)).thenReturn(projectViewImplMock);
            when(projectViewImplMock.getCurrentProjectViewPane()).thenReturn(projectViewPane);
            when(projectViewPane.getSelectedElement()).thenReturn("PsiDirectory:/tmp/test");
            appManager.when(ApplicationManager::getApplication).thenReturn(application);
            PsiFile psiFile = mock(PsiFile.class);
            VirtualFile virtualFile = mock(VirtualFile.class);
            PsiFile[] files = List.of(psiFile).toArray(new PsiFile[0]);
            when(application.runReadAction(ArgumentMatchers.<Computable<PsiFile[]>>any())).thenReturn(files);
            when(psiFile.getVirtualFile()).thenReturn(virtualFile);
            when(virtualFile.getCanonicalPath()).thenReturn("/tmp/test/apis/metadata.yml");
            NotificationGroupManagerImpl notificationGroupManagerImpl = mock(NotificationGroupManagerImpl.class);
            notificationGroupManager.when(NotificationGroupManager::getInstance).thenReturn(notificationGroupManagerImpl);
            NotificationGroup notificationGroup = mock(NotificationGroup.class);
            when(notificationGroupManagerImpl.getNotificationGroup("APIHub")).thenReturn(notificationGroup);
            Notification notification = mock(Notification.class);
            when(notificationGroup.createNotification(anyString(), eq(NotificationType.WARNING))).thenReturn(notification);
            doNothing().when(notification).notify(project);
            when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
            when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);
            doNothing().when(webViewerWindow).reload();


            messageRouterHandler.onQuery(mock(CefBrowser.class), mock(CefFrame.class), 1L, "{\"request\":\"submitCertificationIntelliJ\"}",
                    Boolean.FALSE, mock(CefQueryCallback.class));

            verify(notification).notify(project);
            verify(webViewerWindow).reload();
            verify(webViewerWindow, times(0)).executeJavaScript(any());
        }

    }

    @Test
    public void should_revalidate_api() {
        try (MockedStatic<ProjectView> projectViewMock = mockStatic(ProjectView.class)) {
            projectViewMock.when(() -> ProjectView.getInstance(project)).thenReturn(projectViewImplMock);
            when(projectViewImplMock.getCurrentProjectViewPane()).thenReturn(projectViewPane);
            when(projectViewPane.getSelectedElement()).thenReturn(null);
            when(project.getService(CertificationService.class)).thenReturn(certificationService);
            when(certificationService.getCertificationResults(any(), any(), any())).thenReturn(TestUtils.getSetCertificationResultDTO());
            when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
            when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);
            doNothing().when(webViewerWindow).executeJavaScript(any());

            messageRouterHandler.onQuery(mock(CefBrowser.class), mock(CefFrame.class), 1L,
                    "{\"request\":\"revalidateApi\",\"apiName\":\"REST Sample\",\"apiSpecType\":\"1\",\"validationType\":4,\"apiDefinitionPath\":\"\"}",
                    Boolean.FALSE, mock(CefQueryCallback.class));

            verify(webViewerWindow).executeJavaScript(any());
        }
    }

    @Test
    public void should_open_file() {
        try (MockedStatic<ProjectView> projectViewMock = mockStatic(ProjectView.class);
             MockedStatic<FileUtils> fileUtilsMock = mockStatic(FileUtils.class)) {
            projectViewMock.when(() -> ProjectView.getInstance(project)).thenReturn(projectViewImplMock);
            when(projectViewImplMock.getCurrentProjectViewPane()).thenReturn(projectViewPane);
            when(projectViewPane.getSelectedElement()).thenReturn(null);
            when(project.getService(CertificationService.class)).thenReturn(certificationService);
            fileUtilsMock.when(() -> FileUtils.openFile(any(), any())).thenAnswer((Answer<Void>) invocation -> null);

            when(certificationService.getCertificationResults(any(), any(), any())).thenReturn(TestUtils.getSetCertificationResultDTO());
            when(project.getService(WebViewerWindowService.class)).thenReturn(webViewerWindowService);
            when(webViewerWindowService.getWebViewerWindow()).thenReturn(webViewerWindow);
            doNothing().when(webViewerWindow).executeJavaScript(any());

            messageRouterHandler.onQuery(mock(CefBrowser.class), mock(CefFrame.class), 1L,
                    "{\"request\":\"onClickOpenFile\",\"fileName\":\"/tmp/test/openapi-rest.yml\", \"infoPosition\":{\"line\":1,\"char\":5,\"lastLine\":4,\"lastchar\":16}}",
                    Boolean.FALSE, mock(CefQueryCallback.class));

            fileUtilsMock.verify(() -> FileUtils.openFile(any(), any()));
        }
    }
}
