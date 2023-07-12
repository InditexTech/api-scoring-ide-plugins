// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.test.settings;

import com.inditextech.apiscoring.settings.ApiScoringSettingsState;
import com.intellij.openapi.application.Application;
import com.intellij.openapi.application.ApplicationManager;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.MockedStatic;

import static org.mockito.Mockito.*;

public class ApiScoringSettingsStateTest {

    @Test
    public void should_load_state() {
        ApiScoringSettingsState state = new ApiScoringSettingsState();
        state.setServiceUrl("http://localhost:8080");
        state.setFrontendUrl("http://localhost:3000");

        ApiScoringSettingsState apiScoringSettingsState = new ApiScoringSettingsState();
        apiScoringSettingsState.loadState(state);
        Assert.assertEquals(state.getServiceUrl(), apiScoringSettingsState.getServiceUrl());
        Assert.assertEquals(state.getFrontendUrl(), apiScoringSettingsState.getFrontendUrl());
    }

    @Test
    public void should_get_state() {
        ApiScoringSettingsState state = new ApiScoringSettingsState().getState();
        Assert.assertEquals("http://localhost:8080/apifirst/v1/apis/verify", state.getServiceUrl());
        Assert.assertEquals("http://localhost:3000/", state.getFrontendUrl());
    }

    @Test
    public void should_get_instance() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiScoringSettingsState.class)).thenReturn(new ApiScoringSettingsState());
            ApiScoringSettingsState instance = ApiScoringSettingsState.getInstance();
            Assert.assertEquals("http://localhost:8080/apifirst/v1/apis/verify", instance.getServiceUrl());
            Assert.assertEquals("http://localhost:3000/", instance.getFrontendUrl());
        }
    }


}
