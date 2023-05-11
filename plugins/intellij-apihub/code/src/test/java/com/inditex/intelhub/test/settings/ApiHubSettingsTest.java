package com.inditex.intelhub.test.settings;

import com.inditex.intelhub.settings.ApiHubSettings;
import com.inditex.intelhub.settings.ApiHubSettingsComponent;
import com.inditex.intelhub.settings.ApiHubSettingsState;
import com.intellij.openapi.application.Application;
import com.intellij.openapi.application.ApplicationManager;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;

import javax.swing.*;

import static org.mockito.Mockito.*;

public class ApiHubSettingsTest {

    private ApiHubSettings apiHubSettings;

    @Before
    public void setUp() {
        apiHubSettings = new ApiHubSettings();
    }

    @Test
    public void should_get_display_name() {
        Assert.assertEquals("APIHub Settings", apiHubSettings.getDisplayName());
    }

    @Test
    public void should_return_true_when_settings_is_modified() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiHubSettingsState.class)).thenReturn(new ApiHubSettingsState());
            apiHubSettings.createComponent();

            Assert.assertTrue(apiHubSettings.isModified());
        }
    }

    @Test
    public void should_return_false_when_settings_is_not_modified() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class);
             MockedConstruction<ApiHubSettingsComponent> apiHubSettingsComponentMock = mockConstruction(ApiHubSettingsComponent.class, (mocked, context) -> {
                 when(mocked.getPanel()).thenReturn(mock(JPanel.class));
                 when(mocked.getServiceUrl()).thenReturn("http://localhost:8080/apifirst/v1/validations");
                 when(mocked.getFrontendUrl()).thenReturn("http://localhost:3000/");
             })) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiHubSettingsState.class)).thenReturn(new ApiHubSettingsState());
            apiHubSettings.createComponent();

            Assert.assertFalse(apiHubSettings.isModified());
        }
    }

    @Test
    public void should_apply_settings() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            ApiHubSettingsState settingsState = new ApiHubSettingsState();
            when(application.getService(ApiHubSettingsState.class)).thenReturn(settingsState);
            apiHubSettings.createComponent();

            apiHubSettings.apply();

            Assert.assertEquals("", settingsState.getServiceUrl());
            Assert.assertEquals("", settingsState.getFrontendUrl());
        }
    }

    @Test
    public void should_reset_settings() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class);
             MockedConstruction<ApiHubSettingsComponent> apiHubSettingsComponentMock =
                     mockConstruction(ApiHubSettingsComponent.class, (mocked, context) -> when(mocked.getPanel()).thenReturn(mock(JPanel.class)))
        ) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            ApiHubSettingsState settingsState = new ApiHubSettingsState();
            when(application.getService(ApiHubSettingsState.class)).thenReturn(settingsState);
            apiHubSettings.createComponent();

            apiHubSettings.reset();

            ApiHubSettingsComponent mockedComponent = apiHubSettingsComponentMock.constructed().get(0);
            verify(mockedComponent).setServiceUrl("http://localhost:8080/apifirst/v1/validations");
            verify(mockedComponent).setFrontendUrl("http://localhost:3000/");
        }
    }

    @Test
    public void should_dispose() {
        apiHubSettings.disposeUIResources();
        Assert.assertTrue(Boolean.TRUE);
    }
}
