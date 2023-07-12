// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.settings;

import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.components.PersistentStateComponent;
import com.intellij.openapi.components.State;
import com.intellij.openapi.components.Storage;
import com.intellij.util.xmlb.XmlSerializerUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@State(
        name = "settings.com.inditextech.apiscoring.ApiScoringSettings",
        storages = @Storage("ApiScoringSettingsPlugin.xml")
)
public class ApiScoringSettingsState implements PersistentStateComponent<ApiScoringSettingsState> {
    private String serviceUrl = "http://localhost:8080/apifirst/v1/apis/validate";
    private String frontendUrl = "http://localhost:3000/";


    public static ApiScoringSettingsState getInstance() {
        return ApplicationManager.getApplication().getService(ApiScoringSettingsState.class);
    }

    @Override
    public @Nullable ApiScoringSettingsState getState() {
        return this;
    }

    @Override
    public void loadState(@NotNull ApiScoringSettingsState state) {
        XmlSerializerUtil.copyBean(state, this);
    }

    public String getServiceUrl() {
        return serviceUrl;
    }

    public void setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }
}
