// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.annotations.Expose;

@SuppressWarnings("unused")
@JsonIgnoreProperties
public class CertificationDTO extends Validation{

    @Expose
    private String apiName;    
    @Expose
    private ApiProtocol apiProtocol;    
    @Expose
    private Boolean hasErrors;    
    @Expose
    private List<Result> result;
    @Expose
    private String validationDateTime;    

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public ApiProtocol getApiProtocol() {
        return apiProtocol;
    }

    public void setApiProtocol(ApiProtocol apiProtocol) {
        this.apiProtocol = apiProtocol;
    }

    public Boolean getHasErrors() {
        return hasErrors;
    }

    public void setHasErrors(Boolean hasErrors) {
        this.hasErrors = hasErrors;
    }
    

    public List<Result> getResult() {
        return result;
    }

    public void setResult(List<Result> result) {
        this.result = result;
    }

    public String getValidationDateTime() {
        return validationDateTime;
    }

    public void setValidationDateTime(String validationDateTime) {
        this.validationDateTime = validationDateTime;
    }

}
