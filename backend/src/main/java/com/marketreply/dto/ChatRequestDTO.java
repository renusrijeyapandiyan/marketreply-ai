package com.marketreply.dto;

/** A buyer message sent to the shopping assistant. sessionId is omitted when starting. */
public class ChatRequestDTO {

    private String sellerId;
    private String sessionId;
    private String message;

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
