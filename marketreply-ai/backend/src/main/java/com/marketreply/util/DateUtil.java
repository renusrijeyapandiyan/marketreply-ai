package com.marketreply.util;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/** Formatting helpers for timestamps shown in API responses/logs. */
public final class DateUtil {

    private static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm").withZone(ZoneOffset.UTC);

    private DateUtil() {
    }

    public static String toDisplayString(Instant instant) {
        if (instant == null) {
            return "";
        }
        return DISPLAY_FORMAT.format(instant);
    }
}
