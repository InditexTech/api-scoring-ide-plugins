
package com.inditextech.apiscoring.dto;

@SuppressWarnings("unused")
public class Result {

    private DesignValidation designValidation;

    private SecurityValidation securityValidation;

    private DocumentationValidation documentationValidation;

    public DesignValidation getDesignValidation() {
        return designValidation;
    }

    public void setDesignValidation(DesignValidation designValidation) {
        this.designValidation = designValidation;
    }

    public SecurityValidation getSecurityValidation() {
        return securityValidation;
    }

    public void setSecurityValidation(SecurityValidation securityValidation) {
        this.securityValidation = securityValidation;
    }

    public DocumentationValidation getDocumentationValidation() {
        return documentationValidation;
    }

    public void setDocumentationValidation(DocumentationValidation documentationValidation) {
        this.documentationValidation = documentationValidation;
    }
}
