package com.inditex.intelhub.settings;

import com.intellij.ui.components.JBLabel;
import com.intellij.ui.components.JBTextField;
import com.intellij.util.ui.FormBuilder;
import org.jetbrains.annotations.NotNull;

import javax.swing.*;

public class ApiHubSettingsComponent {

    private final JPanel myMainPanel;
    private final JBTextField myServiceUrl = new JBTextField();
    private final JBTextField myFrontendUrl = new JBTextField();

    public ApiHubSettingsComponent() {
        myMainPanel = FormBuilder.createFormBuilder()
                .addLabeledComponent(new JBLabel("Certification URL: "), myServiceUrl, 1, false)
                .addLabeledComponent(new JBLabel("Frontend URL: "), myFrontendUrl, 1, false)
                .addComponentFillVertically(new JPanel(), 0)
                .getPanel();
    }

    public JPanel getPanel() {
        return myMainPanel;
    }

    @NotNull
    public String getServiceUrl() {
        return myServiceUrl.getText();
    }

    public void setServiceUrl(@NotNull String newText) {
        myServiceUrl.setText(newText);
    }

    public String getFrontendUrl() {
        return myFrontendUrl.getText();
    }

    public void setFrontendUrl(String newText) {
        myFrontendUrl.setText(newText);
    }
}
