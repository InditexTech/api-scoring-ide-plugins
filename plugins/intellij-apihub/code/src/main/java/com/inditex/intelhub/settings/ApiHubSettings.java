package com.inditex.intelhub.settings;


import com.intellij.openapi.options.Configurable;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;


public class ApiHubSettings implements Configurable {

    private ApiHubSettingsComponent mySettingsComponent;

    @Nls(capitalization = Nls.Capitalization.Title)
    @Override
    public String getDisplayName() {
        return "APIHub Settings";
    }

    @Nullable
    @Override
    public JComponent createComponent() {
        mySettingsComponent = new ApiHubSettingsComponent();
        return mySettingsComponent.getPanel();
    }

    @Override
    public boolean isModified() {
        ApiHubSettingsState settings = ApiHubSettingsState.getInstance();
        boolean modified = !mySettingsComponent.getServiceUrl().equals(settings.getServiceUrl());
        modified |= !mySettingsComponent.getFrontendUrl().equals(settings.getFrontendUrl());
        return modified;
    }

    @Override
    public void apply() {
        ApiHubSettingsState settings = ApiHubSettingsState.getInstance();
        settings.setServiceUrl(mySettingsComponent.getServiceUrl());
        settings.setFrontendUrl(mySettingsComponent.getFrontendUrl());
    }

    @Override
    public void reset() {
        ApiHubSettingsState settings = ApiHubSettingsState.getInstance();
        mySettingsComponent.setServiceUrl(settings.getServiceUrl());
        mySettingsComponent.setFrontendUrl(settings.getFrontendUrl());
    }

    @Override
    public void disposeUIResources() {
        mySettingsComponent = null;
    }
}
