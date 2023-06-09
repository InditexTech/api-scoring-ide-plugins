package com.inditextech.intelhub.test.settings;

import com.inditextech.intelhub.settings.ApiScoringSettings;
import com.inditextech.intelhub.settings.ApiScoringSettingsComponent;
import com.inditextech.intelhub.settings.ApiScoringSettingsState;
import com.intellij.openapi.application.Application;
import com.intellij.openapi.application.ApplicationManager;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;

import javax.swing.*;

import static org.mockito.Mockito.*;

public class ApiScoringSettingsTest {

    private ApiScoringSettings apiScoringSettings;

    @Before
    public void setUp() {
        apiScoringSettings = new ApiScoringSettings();
    }

    @Test
    public void should_get_display_name() {
        Assert.assertEquals("APIScoring Settings", apiScoringSettings.getDisplayName());
    }

    @Test
    public void should_return_true_when_settings_is_modified() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiScoringSettingsState.class)).thenReturn(new ApiScoringSettingsState());
            apiScoringSettings.createComponent();

            Assert.assertTrue(apiScoringSettings.isModified());
        }
    }

    @Test
    public void should_return_false_when_settings_is_not_modified() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class);
             MockedConstruction<ApiScoringSettingsComponent> apiScoringSettingsComponentMock = mockConstruction(ApiScoringSettingsComponent.class, (mocked, context) -> {
                 when(mocked.getPanel()).thenReturn(mock(JPanel.class));
                 when(mocked.getServiceUrl()).thenReturn("http://localhost:8080/apifirst/v1/apis/verify");
                 when(mocked.getFrontendUrl()).thenReturn("http://localhost:3000/");
             })) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            when(application.getService(ApiScoringSettingsState.class)).thenReturn(new ApiScoringSettingsState());
            apiScoringSettings.createComponent();

            Assert.assertFalse(apiScoringSettings.isModified());
        }
    }

    @Test
    public void should_apply_settings() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class)) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            ApiScoringSettingsState settingsState = new ApiScoringSettingsState();
            when(application.getService(ApiScoringSettingsState.class)).thenReturn(settingsState);
            apiScoringSettings.createComponent();

            apiScoringSettings.apply();

            Assert.assertEquals("", settingsState.getServiceUrl());
            Assert.assertEquals("", settingsState.getFrontendUrl());
        }
    }

    @Test
    public void should_reset_settings() {
        try (MockedStatic<ApplicationManager> applicationManagerMock = mockStatic(ApplicationManager.class);
             MockedConstruction<ApiScoringSettingsComponent> apiScoringSettingsComponentMock =
                     mockConstruction(ApiScoringSettingsComponent.class, (mocked, context) -> when(mocked.getPanel()).thenReturn(mock(JPanel.class)))
        ) {
            Application application = mock(Application.class);
            applicationManagerMock.when(ApplicationManager::getApplication).thenReturn(application);
            ApiScoringSettingsState settingsState = new ApiScoringSettingsState();
            when(application.getService(ApiScoringSettingsState.class)).thenReturn(settingsState);
            apiScoringSettings.createComponent();

            apiScoringSettings.reset();

            ApiScoringSettingsComponent mockedComponent = apiScoringSettingsComponentMock.constructed().get(0);
            verify(mockedComponent).setServiceUrl("http://localhost:8080/apifirst/v1/apis/verify");
            verify(mockedComponent).setFrontendUrl("http://localhost:3000/");
        }
    }

    @Test
    public void should_dispose() {
        apiScoringSettings.disposeUIResources();
        Assert.assertTrue(Boolean.TRUE);
    }
}
