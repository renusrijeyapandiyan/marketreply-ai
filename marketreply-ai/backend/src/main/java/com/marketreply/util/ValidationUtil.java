package com.marketreply.util;

import com.marketreply.exception.InvalidRequestException;

/** Small reusable validation helpers used across services. */
public final class ValidationUtil {

    private ValidationUtil() {
    }

    public static void requireNonBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new InvalidRequestException(fieldName + " must not be blank");
        }
    }

    public static void requirePositive(Double value, String fieldName) {
        if (value == null || value <= 0) {
            throw new InvalidRequestException(fieldName + " must be a positive number");
        }
    }
}
