package com.marketreply.exception;

/** Thrown when a requested Seller/Conversation id does not exist. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
