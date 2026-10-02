package com.marketreply.exception;

public class GeminiException extends RuntimeException {

    private final int status;
    private final boolean retryable;

    public GeminiException(String message, int status, boolean retryable) {
        super(message);
        this.status = status;
        this.retryable = retryable;
    }

    public int getStatus() {
        return status;
    }

    public boolean isRetryable() {
        return retryable;
    }
}