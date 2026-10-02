package com.marketreply.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public final class JsonUtil {

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

    private JsonUtil() {
    }

    public static ObjectMapper mapper() {
        return MAPPER;
    }

    public static String stripCodeFences(String text) {
        if (text == null) {
            return null;
        }
        String trimmed = text.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```[a-zA-Z]*\\s*", "");
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.length() - 3);
            }
        }
        return trimmed.trim();
    }

    public static String extractJsonObject(String text) {
        String cleaned = stripCodeFences(text);
        if (cleaned == null) {
            return null;
        }
        int start = cleaned.indexOf('{');
        return start >= 0 ? cleaned.substring(start) : cleaned;
    }
}