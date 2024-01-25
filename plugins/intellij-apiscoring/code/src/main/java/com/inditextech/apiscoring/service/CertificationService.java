// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.service;

import com.inditextech.apiscoring.dto.*;
import com.inditextech.apiscoring.utils.FileUtils;
import com.intellij.openapi.project.Project;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.nio.file.Path;
import java.util.List;

public class CertificationService {

    private final Project myProject;

    public CertificationService(Project project) {
        this.myProject = project;
    }

    @NotNull
    public SetCertificationResultDTO getCertificationResults(EventRequestDto eventRequestDto, String event, Path selectedFolderPath) {
        Metadata metadata = new Metadata(FileUtils.readMetadata(myProject, selectedFolderPath));
        String zipFileName = FileUtils.compressProject(myProject, selectedFolderPath, metadata);
        CertificationApi certificationApi = this.myProject.getService(CertificationApi.class);
        List<CertificationDTO> results = certificationApi.postCertification(new File(zipFileName), eventRequestDto, myProject);

        assert results != null;
        String apisPath =
                selectedFolderPath != null ? selectedFolderPath.toString() : FileUtils.getRootPath(myProject);
        return new SetCertificationResultDTO(event, new Payload(results, apisPath, metadata));
    }
}
