package com.inditex.intelhub.test.settings;

import com.inditex.intelhub.settings.ApiHubSettingsComponent;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class ApiHubSettingsComponentTest {
    private ApiHubSettingsComponent component;

    @Before
    public void setUp() {
        component = new ApiHubSettingsComponent();
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