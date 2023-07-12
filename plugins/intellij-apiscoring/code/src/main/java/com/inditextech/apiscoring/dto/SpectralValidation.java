// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;
import javax.annotation.Generated;
import com.google.gson.annotations.Expose;

@Generated("net.hexar.json2pojo")
@SuppressWarnings("unused")
public class SpectralValidation {

    @Expose
    private List<SpectralIssue> issues;

    public List<SpectralIssue> getIssues() {
        return issues;
    }

    public void setIssues(List<SpectralIssue> spectralIssues) {
        this.issues = spectralIssues;
    }

}
