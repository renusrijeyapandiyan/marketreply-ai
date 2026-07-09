package com.marketreply.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Incoming request from the Buyer Analyzer page: which seller's rules to use,
 * and what the buyer said.
 */
public class BuyerMessageRequest {

    @NotBlank(message = "sellerId is required")
    private String sellerId;

    @NotBlank(message = "message is required")
    private String message;

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
}
