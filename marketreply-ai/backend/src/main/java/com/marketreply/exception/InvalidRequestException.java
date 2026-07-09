package com.marketreply.exception;

/** Thrown for malformed input or business-rule validation failures. */
public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}
