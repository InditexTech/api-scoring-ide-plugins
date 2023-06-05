package com.inditex.intelhub.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.inditex.intelhub.exception.CustomRuntimeException;

import java.util.Optional;
import java.util.stream.Stream;

public enum ValidationType {
    DESIGN("DESIGN"),
    DOCUMENTATION("DOCUMENTATION"),
    SECURITY("SECURITY"),
    OVERALL_SCORE("OVERALL_SCORE");
    private final String type;

    ValidationType(String type) {
        this.type = type;
    }

    @JsonValue
    public String getType() {
        return type;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    static ValidationType fromType(String type) {
        Optional<ValidationType> validationType = Stream.of(ValidationType.values()).filter(it -> it.type.equals(type)).findFirst();
        if (validationType.isPresent()) {
            return validationType.get();
        } else {
            throw new CustomRuntimeException("No ValidationType found for type " + type);
        }
    }
}
