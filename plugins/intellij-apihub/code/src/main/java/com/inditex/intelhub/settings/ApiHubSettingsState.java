package com.inditex.intelhub.settings;

import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.components.PersistentStateComponent;
import com.intellij.openapi.components.State;
import com.intellij.openapi.components.Storage;
import com.intellij.util.xmlb.XmlSerializerUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@State(
        name = "com.inditex.intelhub.settings.ApiHubSettings",
        storages = @Storage("ApiHubSettingsPlugin.xml")
)
public class ApiHubSettingsState implements PersistentStateComponent<ApiHubSettingsState> {
    private String serviceUrl = "http://localhost:8080/apifirst/v1/apis/verify";
    private String frontendUrl = "http://localhost:3000/";


    public static ApiHubSettingsState getInstance() {
        return ApplicationManager.getApplication().getService(ApiHubSettingsState.class);
    }

    @Override
    public @Nullable ApiHubSettingsState getState() {
        return this;
    }

    @Override
    public void loadState(@NotNull ApiHubSettingsState state) {
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
