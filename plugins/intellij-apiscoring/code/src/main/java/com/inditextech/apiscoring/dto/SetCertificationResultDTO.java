// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

public class SetCertificationResultDTO {

    public SetCertificationResultDTO(String command, Payload payload) {
        this.command = command;
        this.payload = payload;
    }

    private String command;

    private Payload payload;

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public Payload getPayload() {
        return payload;
    }

    public void setPayload(Payload payload) {
        this.payload = payload;
    }
}
