// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.handlers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inditextech.apiscoring.dto.CertificationDTO;
import com.inditextech.apiscoring.dto.EventRequestDto;
import com.inditextech.apiscoring.dto.SetCertificationResultDTO;
import com.inditextech.apiscoring.exception.CustomRuntimeException;
import com.inditextech.apiscoring.service.CertificationService;
import com.inditextech.apiscoring.service.WebViewerWindowService;
import com.inditextech.apiscoring.utils.FileUtils;
import com.inditextech.apiscoring.window.WebViewerWindow;
import com.intellij.ide.projectView.ProjectView;
import com.intellij.notification.NotificationGroupManager;
import com.intellij.notification.NotificationType;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Computable;
import com.intellij.psi.PsiFile;
import com.intellij.psi.search.FilenameIndex;
import com.intellij.psi.search.GlobalSearchScope;
import org.cef.browser.CefBrowser;
import org.cef.browser.CefFrame;
import org.cef.callback.CefQueryCallback;
import org.cef.handler.CefMessageRouterHandlerAdapter;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class MessageRouterHandler extends CefMessageRouterHandlerAdapter {

    private final Project project;

    public MessageRouterHandler(Project project) {
        this.project = project;
    }

    @Override
    public boolean onQuery(CefBrowser browser, CefFrame frame, long queryId, String request,
                           boolean persistent, CefQueryCallback callback) {
        ObjectMapper mapper = new ObjectMapper();
        EventRequestDto eventRequest;

        try {
            eventRequest = mapper.readValue(request, EventRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new CustomRuntimeException(e);
        }

        CertificationService certificationService = this.project.getService(CertificationService.class);
        Path selectedFolderPath = getSelectFolderPath();
        if (eventRequest.getRequest().startsWith("revalidateApi") || eventRequest.getRequest().startsWith("revalidateModule")) {
            SetCertificationResultDTO setCertificationResultDTO =
                    certificationService.getCertificationResults(eventRequest, "setModuleResults", selectedFolderPath);
            setCertificationResultDTO.getPayload()
                    .setResults(this.filterApiResults(eventRequest.getApiName(), setCertificationResultDTO.getPayload().getResults()));
            setCertificationResultDTO.getPayload().setApiModule(eventRequest);
            this.sendToFrontend(setCertificationResultDTO);
        } else if (eventRequest.getRequest().startsWith("onClickOpenFile")) {
            FileUtils.openFile(project, eventRequest);
        } else if (eventRequest.getRequest().startsWith("submitCertificationIntelliJ")) {
            if (hasMultipleApiRepositories(project) && selectedFolderPath == null || selectedFolderPath != null && !isApiFolder(
                    selectedFolderPath)) {
                NotificationGroupManager.getInstance()
                        .getNotificationGroup("APIScoring")
                        .createNotification("You haven't selected the root directory of the API you want to certify. Close the webview and try again.",
                                NotificationType.WARNING)
                        .notify(project);
                project.getService(WebViewerWindowService.class).getWebViewerWindow().reload();
                return false;
            }
            SetCertificationResultDTO dto =
                    certificationService.getCertificationResults(null, "setCertificationResults", selectedFolderPath);
            this.sendToFrontend(dto);
        } else {
            return false;
        }
        return true;
    }

    private void sendToFrontend(SetCertificationResultDTO dto) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        String jsonStr = null;
        try {
            jsonStr = mapper.writeValueAsString(dto);
        } catch (IOException e) {
            throw new CustomRuntimeException(e);
        }

        assert jsonStr != null;
        WebViewerWindow webViewerWindow = project.getService(WebViewerWindowService.class).getWebViewerWindow();
        webViewerWindow.executeJavaScript(String.format("window.iframe.contentWindow.postMessage(%s, \"*\")", jsonStr));
    }

    private List<CertificationDTO> filterApiResults(final String apiName, final List<CertificationDTO> results) {
        return results.stream().filter(r -> apiName.equals(r.getApiName())).collect(Collectors.toList());
    }

    private boolean isApiFolder(Path selectedFolderPath) {
        Path metadataFilePath = Paths.get(selectedFolderPath.toString(), "metadata.yml");
        PsiFile[] files = ApplicationManager.getApplication()
                .runReadAction((Computable<PsiFile[]>) () ->
                        FilenameIndex.getFilesByName(project, metadataFilePath.getFileName().toString(), GlobalSearchScope.allScope(project)));
        for (PsiFile file : files) {
            if (Paths.get(Objects.requireNonNull(file.getVirtualFile().getCanonicalPath())).compareTo(metadataFilePath) == 0) {
                return true;
            }
        }
        return false;
    }

    @Nullable
    private Path getSelectFolderPath() {
        Path folderPath = null;
        if (null != ProjectView.getInstance(project).getCurrentProjectViewPane()
                && null != ProjectView.getInstance(project).getCurrentProjectViewPane().getSelectedElement()
                && (ProjectView.getInstance(project).getCurrentProjectViewPane().getSelectedElement().toString().contains("PsiDirectory:"))) {
            folderPath = Paths.get(ProjectView.getInstance(project).getCurrentProjectViewPane().getSelectedElement().toString().split("PsiDirectory:")[1]);

        }
        return folderPath;
    }

    private boolean hasMultipleApiRepositories(Project project) {
        PsiFile[] metadataFiles = ApplicationManager.getApplication()
                .runReadAction(
                        (Computable<PsiFile[]>) () -> FilenameIndex.getFilesByName(project, "metadata.yml", GlobalSearchScope.allScope(project)));
        return metadataFiles.length > 1;
    }
}
