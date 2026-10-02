package com.marketreply.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/** Payload a buyer submits to place an order against a seller's listing. */
public class CreateOrderRequest {

    @NotBlank(message = "sellerId is required")
    private String sellerId;

    /** Optional: links this order back to the conversation that led to it. */
    private String conversationId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity = 1;

    private String deliveryMethod; // "DELIVERY" | "PICKUP"
    private String deliveryAddress;
    private String buyerNotes;

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getBuyerNotes() {
        return buyerNotes;
    }

    public void setBuyerNotes(String buyerNotes) {
        this.buyerNotes = buyerNotes;
    }
}