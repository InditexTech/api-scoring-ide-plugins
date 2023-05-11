
package com.inditex.intelhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.Expose;

@SuppressWarnings("unused")
public class Api {

    @Expose
    @JsonProperty("api-spec-type")
    private String apiSpecType;
    @Expose
    @JsonProperty("definition-path")
    private String definitionPath;
    @Expose
    @JsonProperty("definition-file")
    private String definitionFile;
    @Expose
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
