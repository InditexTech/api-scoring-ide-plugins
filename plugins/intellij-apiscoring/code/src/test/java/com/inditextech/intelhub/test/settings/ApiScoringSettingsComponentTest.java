package com.inditextech.intelhub.test.settings;

import com.inditextech.intelhub.settings.ApiScoringSettingsComponent;
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
