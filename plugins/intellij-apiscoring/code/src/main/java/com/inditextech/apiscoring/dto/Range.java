// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

package com.inditextech.apiscoring.dto;

import javax.annotation.Generated;
import com.google.gson.annotations.Expose;

@Generated("net.hexar.json2pojo")
@SuppressWarnings("unused")
public class Range {

    @Expose
    private RangeInfo end;
    @Expose
    private RangeInfo start;

    public RangeInfo getEnd() {
        return end;
    }

    public void setEnd(RangeInfo end) {
        this.end = end;
    }

    public RangeInfo getStart() {
        return start;
    }

    public void setStart(RangeInfo start) {
        this.start = start;
    }

}
