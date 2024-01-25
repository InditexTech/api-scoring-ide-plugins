// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.test.settings;

import com.inditextech.apiscoring.settings.ApiScoringSettingsComponent;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class ApiScoringSettingsComponentTest {
    private ApiScoringSettingsComponent component;

    @Before
    public void setUp() {
        component = new ApiScoringSettingsComponent();
    }

    @Test
    public void should_set_service_url() {
        final String serviceUrl = "http://localhost:8080";
        component.setServiceUrl(serviceUrl);
        Assert.assertEquals(serviceUrl, component.getServiceUrl());
    }

    @Test
    public void should_set_frontend_url() {
        final String frontendUrl = "http://localhost:3000";
        component.setFrontendUrl(frontendUrl);
        Assert.assertEquals(frontendUrl, component.getFrontendUrl());
    }
}
