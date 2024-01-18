// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;
import javax.annotation.Generated;
import com.google.gson.annotations.Expose;

@Generated("net.hexar.json2pojo")
@SuppressWarnings("unused")
public class DocumentationValidation extends Validation {

    @Expose
    private List<DocumentationIssue> issues;

    @Expose
    private ValidationType validationType;

    public List<DocumentationIssue> getIssues() {
        return issues;
    }

    public void setIssues(List<DocumentationIssue> documentationIssues) {
        this.issues = documentationIssues;
    }

    public ValidationType getValidationType() {
        return validationType;
    }

    public void setValidationType(ValidationType validationType) {
        this.validationType = validationType;
    }
}
