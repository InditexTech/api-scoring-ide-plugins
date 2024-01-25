// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import javax.annotation.Generated;
import com.google.gson.annotations.Expose;

@Generated("net.hexar.json2pojo")
@SuppressWarnings("unused")
public class RangeInfo {

    @Expose
    private Long character;
    @Expose
    private Long line;

    public Long getCharacter() {
        return character;
    }

    public void setCharacter(Long character) {
        this.character = character;
    }

    public Long getLine() {
        return line;
    }

    public void setLine(Long line) {
        this.line = line;
    }

}
