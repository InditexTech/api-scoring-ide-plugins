package com.inditex.intelhub.test.settings;

import com.inditex.intelhub.settings.ApiHubSettingsState;
import com.intellij.openapi.application.Application;
import com.intellij.openapi.application.ApplicationManager;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.MockedStatic;

import static org.mockito.Mockito.*;

public class ApiHubSettingsStateTest {

    @Test
    public void should_load_state() {
        ApiHubSettingsState state = new ApiHubSettingsState();
        state.setServiceUrl("http://localhost:8080");
        state.setFrontendUrl("http://localhost:3000");

        ApiHubSettingsState apiHubSettingsState = new ApiHubSettingsState();
        apiHubSettingsState.loadState(state);
        Assert.assertEquals(state.getServiceUrl(), apiHubSettingsState.getServiceUrl());
        Assert.assertEquals(state.getFrontendUrl(), apiHubSettingsState.getFrontendUrl());
    }

    @Test
    public void should_get_state() {
        ApiHubSettingsState state = new ApiHubSettingsState().getState();
        Assert.assertEquals("http://localhost:8080/apifirst/v1/apis/verify", state.getServiceUrl());
        Assert.assertEquals("http://localhost:3000/", state.getFrontendUrl());
    }

    @Test
    public void should_get_instance() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiHubSettingsState.class)).thenReturn(new ApiHubSettingsState());
            ApiHubSettingsState instance = ApiHubSettingsState.getInstance();
            Assert.assertEquals("http://localhost:8080/apifirst/v1/apis/verify", instance.getServiceUrl());
            Assert.assertEquals("http://localhost:3000/", instance.getFrontendUrl());
        }
    }


}
