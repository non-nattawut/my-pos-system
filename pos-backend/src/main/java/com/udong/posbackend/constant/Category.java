package com.udong.posbackend.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Category {
    MAINS("MAINS"),
    DRINKS("DRINKS"),
    DESSERTS("DESSERTS"),
    MERCH("MERCH");

    private final String value;

    Category(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
