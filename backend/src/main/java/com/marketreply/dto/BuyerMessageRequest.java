package com.marketreply.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * Incoming request from the Buyer Analyzer page: which seller's rules to use,
 * what the buyer said, and (optionally) prior turns in this chat so Gemini
 * can reply with context instead of treating every message in isolation.
 */
public class BuyerMessageRequest {

    @NotBlank(message = "sellerId is required")
    private String sellerId;

    @NotBlank(message = "message is required")
    private String message;

    /** Prior turns in this conversation, oldest first. Optional — null/empty means first message. */
    private List<ChatTurnDTO> history;

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatTurnDTO> getHistory() {
        return history;
    }

    public void setHistory(List<ChatTurnDTO> history) {
        this.history = history;
    }
}