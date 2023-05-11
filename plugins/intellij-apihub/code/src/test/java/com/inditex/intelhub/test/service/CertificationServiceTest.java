package com.inditex.intelhub.test.service;

import com.inditex.intelhub.dto.*;
import com.inditex.intelhub.service.CertificationApi;
import com.inditex.intelhub.service.CertificationService;
import com.inditex.intelhub.test.TestUtils;
import com.inditex.intelhub.utils.FileUtils;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.project.ex.ProjectEx;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedStatic;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;

public class CertificationServiceTest {

    private CertificationService certificationService;
    private Project project;
    private CertificationApi certificationApi;

    @Before
    public void setUp() {
        project = mock(ProjectEx.class);
        certificationService = new CertificationService(project);
        certificationApi = mock(CertificationApi.class);
    }

    @Test
    public void should_get_certification_results_for_project() {

        EventRequestDto requestDto = new EventRequestDto();
        requestDto.setRequest("submitCertificationIntelliJ");
        MetadataDto metadataDto = TestUtils.metadataDto();
        
        when(project.getService(CertificationApi.class)).thenReturn(certificationApi);
        CertificationDTO certificationDTO = TestUtils.certificationDTO();
        when(certificationApi.postCertification(any(), any(), any())).thenReturn(List.of(certificationDTO));

        try (MockedStatic<FileUtils> fileUtils = mockStatic(FileUtils.class)) {
            fileUtils.when(() -> FileUtils.readMetadata(any(), any()))
                    .thenReturn(metadataDto);
            fileUtils.when(() -> FileUtils.compressProject(any(), any(), any())).thenReturn(UUID.randomUUID().toString() + ".zip");
            SetCertificationResultDTO setCertificationResultDTO =
                    certificationService.getCertificationResults(requestDto, "setCertificationResults", null);
            Assert.assertEquals("setCertificationResults", setCertificationResultDTO.getCommand());
            ApiDto apiDto = setCertificationResultDTO.getPayload().getMetadata().getApis().get(0);
            Assert.assertEquals("REST", apiDto.getApiSpecType());
            Assert.assertEquals("REST Sample", apiDto.getName());
            Assert.assertEquals(1, setCertificationResultDTO.getPayload().getResults().size());
            CertificationDTO resultCertificationDTO = setCertificationResultDTO.getPayload().getResults().get(0);
            Assert.assertEquals(certificationDTO.getResult().size(), resultCertificationDTO.getResult().size());
        }
    }

}
