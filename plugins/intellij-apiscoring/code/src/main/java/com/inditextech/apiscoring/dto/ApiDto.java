// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

public class ApiDto {

    public ApiDto(Api api){
        this.apiSpecType = api.getApiSpecType();
        this.definitionPath = api.getDefinitionPath();
        this.definitionFile = api.getDefinitionFile();
        this.name = api.getName();
        
    }

    private String apiSpecType;
    private String definitionPath;
    private String definitionFile;
    private String name;

    public String getApiSpecType() {
        return apiSpecType;
    }

    public void setApiSpecType(String apiSpecType) {
        this.apiSpecType = apiSpecType;
    }

    public String getDefinitionPath() {
        return definitionPath;
    }

    public void setDefinitionPath(String definitionPath) {
        this.definitionPath = definitionPath;
    }

    public String getDefinitionFile() {
        return definitionFile;
    }

    public void setDefinitionFile(String definitionFile) {
        this.definitionFile = definitionFile;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
