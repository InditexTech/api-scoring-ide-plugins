package com.inditex.intelhub.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inditex.intelhub.dto.CertificationDTO;
import com.inditex.intelhub.dto.EventRequestDto;
import com.inditex.intelhub.dto.ValidationType;
import com.inditex.intelhub.exception.CustomRuntimeException;
import com.inditex.intelhub.settings.ApiHubSettingsState;
import com.intellij.notification.NotificationGroupManager;
import com.intellij.notification.NotificationType;
import com.intellij.openapi.project.Project;
import okhttp3.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class CertificationApi {

    public CertificationApi() {
        // empty
    }
    
    public List<CertificationDTO> postCertification(File f, EventRequestDto eventRequestDto, Project project) {
        OkHttpClient okHttpClient = new OkHttpClient()
                .newBuilder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
        MediaType a = MediaType.get("application/zip");
        RequestBody fileBody = RequestBody.create(f, a);

        MultipartBody multipartBody;
        if (eventRequestDto == null) {
            multipartBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("url", f.getName(), fileBody)
                    .addFormDataPart("isVerbose", "true")
                    .addFormDataPart("validationType", String.valueOf(ValidationType.OVERALL_SCORE.getType()))
                    .build();
        } else {
            multipartBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("url", f.getName(), fileBody)
                    .addFormDataPart("isVerbose", "true")
                    .addFormDataPart("validationType", String.valueOf(eventRequestDto.getValidationType().getType()))
                    .build();
        }
        final String serviceUrl = ApiHubSettingsState.getInstance().getServiceUrl();
        Request request = new Request.Builder()
                .url(serviceUrl)
                .post(multipartBody)
                .build();
        List<CertificationDTO> responseDto;
        try {
            Response resp = okHttpClient.newCall(request).execute();
            assert resp.body() != null;
            String response = resp.body().string();

            ObjectMapper objectMapper = new ObjectMapper();
            responseDto = objectMapper.readValue(response, objectMapper.getTypeFactory().constructCollectionType(List.class, CertificationDTO.class));

            resp.close();
        } catch (IOException ex) {
            NotificationGroupManager.getInstance()
                    .getNotificationGroup("APIHub")
                    .createNotification("Something wrong happened while certifying your repository." + ex.getMessage(), NotificationType.ERROR)
                    .notify(project);
            throw new CustomRuntimeException(ex);
        }
        return responseDto;
    }
}
