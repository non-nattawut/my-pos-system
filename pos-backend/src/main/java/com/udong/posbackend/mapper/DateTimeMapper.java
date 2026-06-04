package com.udong.posbackend.mapper;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;

@Component
public class DateTimeMapper {

    public ZonedDateTime toZonedDateTime(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }
        return localDateTime.atZone(ZoneId.systemDefault());
    }
}
