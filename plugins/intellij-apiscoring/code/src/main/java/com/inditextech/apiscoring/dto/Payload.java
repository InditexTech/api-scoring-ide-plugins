// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import java.util.List;

@SuppressWarnings("unused")
public class Payload {

    public Payload(List<CertificationDTO> results, String rootPath, Metadata metadata) {
        this.results = results;
        this.rootPath = rootPath;
        this.metadata = metadata;
    }

    public Payload(List<CertificationDTO> results, String rootPath, Metadata metadata, EventRequestDto apiModule) {
        this.results = results;
        this.rootPath = rootPath;
        this.metadata = metadata;
        this.apiModule = apiModule;
    }

    private List<CertificationDTO> results;

    private String rootPath;

    private Metadata metadata;

    private EventRequestDto apiModule;

    public List<CertificationDTO> getResults() {
        return results;
    }

    public void setResults(List<CertificationDTO> results) {
        this.results = results;
    }

    public String getRootPath() {
        return rootPath;
    }

    public void setRootPath(String rootPath) {
        this.rootPath = rootPath;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public EventRequestDto getApiModule() {
        return apiModule;
    }

    public void setApiModule(EventRequestDto apiModule) {
        this.apiModule = apiModule;
    }
}
