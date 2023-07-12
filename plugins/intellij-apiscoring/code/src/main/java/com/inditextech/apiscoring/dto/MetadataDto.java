// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;

public class MetadataDto {
    private List<Api> apis;


    public List<Api> getApis() {
        return apis;
    }

    public void setApis(List<Api> api) {
        this.apis = api;
    }
    
}
