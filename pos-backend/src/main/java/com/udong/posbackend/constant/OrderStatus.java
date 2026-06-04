package com.udong.posbackend.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {
    PENDING,
    PREPARING,
    READY,
    COMPLETED
}
