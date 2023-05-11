package com.inditex.intelhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PositionInfoDto {

    private Long line;
    @JsonProperty("char")
    private Long charPosition;
    private Long lastLine;
    private Long lastchar;

    public Long getLine() {
        return line;
    }

    public void setLine(Long line) {
        this.line = line;
    }

    public Long getCharPosition() {
        return charPosition;
    }

    public void setCharPosition(Long charPosition) {
        this.charPosition = charPosition;
    }

    public Long getLastLine() {
        return lastLine;
    }

    public void setLastLine(Long lastLine) {
        this.lastLine = lastLine;
    }

    public Long getLastchar() {
        return lastchar;
    }

    public void setLastchar(Long lastchar) {
        this.lastchar = lastchar;
    }
}
