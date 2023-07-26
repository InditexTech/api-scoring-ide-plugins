// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.settings;


import com.intellij.openapi.options.Configurable;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.Nullable;
import javax.swing.*;

public class ApiScoringSettings implements Configurable {

    private ApiScoringSettingsComponent mySettingsComponent;

    @Nls(capitalization = Nls.Capitalization.Title)
    @Override
    public String getDisplayName() {
        return "APIScoring Settings";
    }

    @Nullable
    @Override
    public JComponent createComponent() {
        mySettingsComponent = new ApiScoringSettingsComponent();
        return mySettingsComponent.getPanel();
    }

    @Override
    public boolean isModified() {
        ApiScoringSettingsState settings = ApiScoringSettingsState.getInstance();
        boolean modified = !mySettingsComponent.getServiceUrl().equals(settings.getServiceUrl());
        modified |= !mySettingsComponent.getFrontendUrl().equals(settings.getFrontendUrl());
        return modified;
    }

    @Override
    public void apply() {
        ApiScoringSettingsState settings = ApiScoringSettingsState.getInstance();
        settings.setServiceUrl(mySettingsComponent.getServiceUrl());
        settings.setFrontendUrl(mySettingsComponent.getFrontendUrl());
    }

    @Override
    public void reset() {
        ApiScoringSettingsState settings = ApiScoringSettingsState.getInstance();
        mySettingsComponent.setServiceUrl(settings.getServiceUrl());
        mySettingsComponent.setFrontendUrl(settings.getFrontendUrl());
    }

    @Override
    public void disposeUIResources() {
        mySettingsComponent = null;
    }
}
