package com.inditex.intelhub.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.inditex.intelhub.exception.CustomRuntimeException;

import java.util.Optional;
import java.util.stream.Stream;

public enum ValidationType {
    DESIGN(1),
    DOCUMENTATION(2),
    SECURITY(3),
    OVERALL_SCORE(4);
    private final Integer type;

    ValidationType(Integer type) {
        this.type = type;
    }

    @JsonValue
    public Integer getType() {
        return type;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    static ValidationType fromType(Integer type) {
        Optional<ValidationType> validationType = Stream.of(ValidationType.values()).filter(it -> it.type.equals(type)).findFirst();
        if (validationType.isPresent()) {
            return validationType.get();
        } else {
            throw new CustomRuntimeException("No ValidationType found for type " + type);
        }
    }
}
