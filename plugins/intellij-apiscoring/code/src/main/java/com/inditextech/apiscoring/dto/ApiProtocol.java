// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.inditextech.apiscoring.exception.CustomRuntimeException;

import java.util.Optional;
import java.util.stream.Stream;

public enum ApiProtocol {
    REST("REST"),
    EVENT("EVENT"),
    GRPC("GRPC");
    
    private final String type;

    ApiProtocol(String type) {
        this.type = type;
    }

    @JsonValue
    public String getType() {
        return type;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    static ApiProtocol fromType(String type) {
        Optional<ApiProtocol> apiProtocol = Stream.of(ApiProtocol.values()).filter(it -> it.type.equals(type)).findFirst();
        if (apiProtocol.isPresent()) {
            return apiProtocol.get();
        } else {
            throw new CustomRuntimeException("No ApiProtocol found for type " + type);
        }
    }
}
