// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;

import com.google.gson.annotations.Expose;

@SuppressWarnings("unused")
public class DocumentationIssue {

    @Expose
    private Object errorContext;
    @Expose
    private String errorDetail;
    @Expose
    private Object errorRange;
    @Expose
    private String fileName;
    @Expose
    private Long lineNumber;
    @Expose
    private String ruleDescription;
    @Expose
    private String ruleInformation;
    @Expose
    private List<String> ruleNames;
    @Expose
    private Long severity;

    public Object getErrorContext() {
        return errorContext;
    }

    public void setErrorContext(Object errorContext) {
        this.errorContext = errorContext;
    }

    public String getErrorDetail() {
        return errorDetail;
    }

    public void setErrorDetail(String errorDetail) {
        this.errorDetail = errorDetail;
    }

    public Object getErrorRange() {
        return errorRange;
    }

    public void setErrorRange(Object errorRange) {
        this.errorRange = errorRange;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Long lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getRuleDescription() {
        return ruleDescription;
    }

    public void setRuleDescription(String ruleDescription) {
        this.ruleDescription = ruleDescription;
    }

    public String getRuleInformation() {
        return ruleInformation;
    }

    public void setRuleInformation(String ruleInformation) {
        this.ruleInformation = ruleInformation;
    }

    public List<String> getRuleNames() {
        return ruleNames;
    }

    public void setRuleNames(List<String> ruleNames) {
        this.ruleNames = ruleNames;
    }

    public Long getSeverity() {
        return severity;
    }

    public void setSeverity(Long severity) {
        this.severity = severity;
    }

}
