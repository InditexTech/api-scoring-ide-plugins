// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

public class EventRequestDto {

    private String request;
    private String apiName;
    private String apiSpecType;
    private ValidationType validationType;
    private String apiDefinitionPath;
    private String definitionPath;
    private String fileName;
    private PositionInfoDto infoPosition;

    public String getRequest() {
        return request;
    }

    public void setRequest(String request) {
        this.request = request;
    }

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public String getApiSpecType() {
        return apiSpecType;
    }

    public void setApiSpecType(String apiSpecType) {
        this.apiSpecType = apiSpecType;
    }
    
    public ValidationType getValidationType() {
        return validationType;
    }

    public void setValidationType(ValidationType validationType) {
        this.validationType = validationType;
    }

    public String getApiDefinitionPath() {
        return apiDefinitionPath;
    }

    public void setApiDefinitionPath(String apiDefinitionPath) {
        this.apiDefinitionPath = apiDefinitionPath;
    }

    public String getDefinitionPath() {
        return definitionPath;
    }

    public void setDefinitionPath(String definitionPath) {
        this.definitionPath = definitionPath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public PositionInfoDto getInfoPosition() {
        return infoPosition;
    }

    public void setInfoPosition(PositionInfoDto infoPosition) {
        this.infoPosition = infoPosition;
    }
}
