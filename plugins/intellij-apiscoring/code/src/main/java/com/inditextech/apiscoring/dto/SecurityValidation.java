// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import com.google.gson.annotations.Expose;

public class SecurityValidation extends Validation {

    @Expose
    private ProtolintValidation protolintValidation;

    @Expose
    private SpectralValidation spectralValidation;

    @Expose
    private ValidationType validationType;


    public ProtolintValidation getProtolintValidation() {
        return protolintValidation;
    }

    public void setProtolintValidation(ProtolintValidation protolintValidation) {
        this.protolintValidation = protolintValidation;
    }


    public SpectralValidation getSpectralValidation() {
        return spectralValidation;
    }

    public void setSpectralValidation(SpectralValidation spectralValidation) {
        this.spectralValidation = spectralValidation;
    }

    public ValidationType getValidationType() {
        return validationType;
    }

    public void setValidationType(ValidationType validationType) {
        this.validationType = validationType;
    }
}
