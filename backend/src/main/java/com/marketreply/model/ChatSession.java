package com.marketreply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * One buyer's negotiation + checkout conversation about one product.
 *
 * The session is the single source of truth for the deal: the agreed price, quantity and the
 * delivery / payment details collected so far live HERE (server side), never in the browser, so a
 * buyer cannot fake a discount when the order is finally placed.
 */
@Document(collection = "chat_sessions")
public class ChatSession {

    public static final String STAGE_CHATTING = "CHATTING";
    public static final String STAGE_CONFIRMING = "CONFIRMING";
    public static final String STAGE_ORDERED = "ORDERED";

    @Id
    private String id;

    @Indexed
    private String sellerId;

    @Indexed
    private String buyerId;

    private List<ChatMessage> messages = new ArrayList<>();

    // ---- negotiation state ----
    private Double lastCounter;      // last price the assistant proposed
    private Double agreedPrice;      // set only when a price is accepted
    private int negotiationRounds;
    private boolean finalPrice;      // assistant has reached the lowest it can go

    // ---- order draft ----
    private Integer quantity;
    private String deliveryMethod;   // DELIVERY | PICKUP
    private String deliveryAddress;
    private String paymentMethod;
    private String buyerPhone;

    private String stage = STAGE_CHATTING;
    private String orderId;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public ChatSession() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }

    public Double getLastCounter() { return lastCounter; }
    public void setLastCounter(Double lastCounter) { this.lastCounter = lastCounter; }

    public Double getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(Double agreedPrice) { this.agreedPrice = agreedPrice; }

    public int getNegotiationRounds() { return negotiationRounds; }
    public void setNegotiationRounds(int negotiationRounds) { this.negotiationRounds = negotiationRounds; }

    public boolean isFinalPrice() { return finalPrice; }
    public void setFinalPrice(boolean finalPrice) { this.finalPrice = finalPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(String deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
