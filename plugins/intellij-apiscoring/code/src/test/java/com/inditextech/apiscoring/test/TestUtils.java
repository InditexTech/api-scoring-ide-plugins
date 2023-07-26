package com.inditextech.apiscoring.test;

import com.inditextech.apiscoring.dto.*;

import java.util.List;

public class TestUtils {

    public static CertificationDTO certificationDTO() {
        CertificationDTO certificationDTO = new CertificationDTO();
        certificationDTO.setApiName("REST Sample");
        certificationDTO.setApiProtocol(ApiProtocol.REST);
        certificationDTO.setHasErrors(Boolean.TRUE);
        certificationDTO.setRating("B");
        certificationDTO.setRatingDescription("Good");
        certificationDTO.setScore(86.95);
        certificationDTO.setValidationDateTime("2023-02-07T11:37:29.867Z");
        certificationDTO.setResult(List.of(designResult(), securityResult(), documentationResult()));

        return certificationDTO;
    }


    public static MetadataDto metadataDto() {
        MetadataDto metadataDto = new MetadataDto();
        metadataDto.setApis(List.of(api()));
        return metadataDto;
    }

    public static Api api() {
        Api api = new Api();
        api.setName("REST Sample");
        api.setApiSpecType("REST");
        api.setDefinitionFile("openapi-rest.yml");
        api.setDefinitionPath("apis");
        return api;
    }

    public static SetCertificationResultDTO getSetCertificationResultDTO() {
        MetadataDto metadataDto = metadataDto();
        Payload payload = new Payload(List.of(TestUtils.certificationDTO()), "/tmp/test/apis", new Metadata(metadataDto));
        return new SetCertificationResultDTO("setModuleResults", payload);
    }

    public static Result designResult() {
        Result result = new Result();
        result.setDesignValidation(designValidation());
        return result;
    }

    public static Result securityResult() {
        Result result = new Result();
        result.setSecurityValidation(securityValidation());
        return result;
    }

    public static Result documentationResult() {
        Result result = new Result();
        result.setDocumentationValidation(documentationValidation());
        return result;
    }

    public static DesignValidation designValidation() {
        DesignValidation designValidation = new DesignValidation();
        designValidation.setValidationType(ValidationType.DESIGN);
        designValidation.setScore(97.4);
        designValidation.setRating("A");
        designValidation.setRatingDescription("Very Good");

        SpectralValidation spectralValidation = new SpectralValidation();
        SpectralIssue spectralIssue = new SpectralIssue();
        spectralIssue.setCode("contact-email");
        spectralIssue.setMessage("Definition must have a contact email");
        spectralIssue.setFileName("/apis/openapi-rest.yml");
        spectralIssue.setSeverity(0L);
        spectralIssue.setSource("/apis/openapi-rest.yml");
        spectralIssue.setPath(List.of("info"));
        Range range = new Range();
        RangeInfo start = new RangeInfo();
        start.setLine(1L);
        start.setCharacter(5L);
        RangeInfo end = new RangeInfo();
        end.setCharacter(10L);
        end.setLine(1L);
        range.setStart(start);
        range.setEnd(end);        
        spectralIssue.setRange(range);
        spectralValidation.setIssues(List.of(spectralIssue));
        designValidation.setSpectralValidation(spectralValidation);

        return designValidation;
    }

    public static SecurityValidation securityValidation() {
        SecurityValidation securityValidation = new SecurityValidation();
        securityValidation.setValidationType(ValidationType.SECURITY);
        securityValidation.setRating("C");
        securityValidation.setRatingDescription("Adequate");
        securityValidation.setScore(71.43);
        SpectralValidation spectralValidation = new SpectralValidation();
        SpectralIssue spectralIssue = new SpectralIssue();
        spectralIssue.setCode("global-security");
        spectralIssue.setMessage("Global 'security' field is not defined");
        spectralIssue.setFileName("/apis/openapi-rest.yml");
        spectralIssue.setSeverity(0L);
        spectralIssue.setSource("/apis/openapi-rest.yml");
        Range range = new Range();
        RangeInfo start = new RangeInfo();
        start.setLine(1L);
        start.setCharacter(5L);
        RangeInfo end = new RangeInfo();
        end.setCharacter(10L);
        end.setLine(1L);
        range.setStart(start);
        range.setEnd(end);
        spectralIssue.setRange(range);
        spectralValidation.setIssues(List.of(spectralIssue));
        securityValidation.setSpectralValidation(spectralValidation);
        return securityValidation;
    }

    public static DocumentationValidation documentationValidation() {
        DocumentationValidation documentationValidation = new DocumentationValidation();
        documentationValidation.setValidationType(ValidationType.DOCUMENTATION);
        documentationValidation.setRating("A");
        documentationValidation.setRatingDescription("Very Good");
        documentationValidation.setScore(98.72);

        DocumentationIssue documentationIssue = new DocumentationIssue();
        documentationIssue.setErrorContext(null);
        documentationIssue.setErrorDetail("Expected: 1; Actual: 2");
        documentationIssue.setErrorRange(null);
        documentationIssue.setFileName("apis/README.md");
        documentationIssue.setLineNumber(1L);
        documentationIssue.setRuleInformation("https://github.com/DavidAnson/markdownlint/blob/v0.25.1/doc/Rules.md#md012");
        documentationIssue.setSeverity(1L);
        documentationIssue.setRuleDescription("Multiple consecutive blank lines");
        documentationIssue.setRuleNames(List.of("MD012", "no-multiple-blanks"));

        documentationValidation.setIssues(List.of(documentationIssue));
        return documentationValidation;
    }

}
