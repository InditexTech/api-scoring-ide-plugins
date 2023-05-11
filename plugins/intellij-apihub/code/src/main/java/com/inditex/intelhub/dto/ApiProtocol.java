package com.inditex.intelhub.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.inditex.intelhub.exception.CustomRuntimeException;

import java.util.Optional;
import java.util.stream.Stream;

public enum ApiProtocol {
    REST(1),
    EVENT(2),
    GRPC(3);
    
    private final Integer type;

    ApiProtocol(Integer type) {
        this.type = type;
    }

    @JsonValue
    public Integer getType() {
        return type;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    static ApiProtocol fromType(Integer type) {
        Optional<ApiProtocol> apiProtocol = Stream.of(ApiProtocol.values()).filter(it -> it.type.equals(type)).findFirst();
        if (apiProtocol.isPresent()) {
            return apiProtocol.get();
        } else {
            throw new CustomRuntimeException("No ApiProtocol found for type " + type);
        }
    }
}
