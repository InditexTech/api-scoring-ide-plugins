package com.inditex.intelhub.dto;

import java.util.ArrayList;
import java.util.List;

public class Metadata {

    public Metadata(MetadataDto metadataDto) {
        List<ApiDto> apisList = new ArrayList<>();
        for (Api api : metadataDto.getApis()) {
            apisList.add(new ApiDto(api));
        }
        this.apis = apisList;
    }

    private List<ApiDto> apis;

    public List<ApiDto> getApis() {
        return apis;
    }

    public void setApis(List<ApiDto> api) {
        this.apis = api;
    }
}
