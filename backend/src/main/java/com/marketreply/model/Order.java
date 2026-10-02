package com.marketreply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * A full purchase record created when a buyer commits to buying from a
 * seller's listing: item, price, quantity, and a status the seller
 * progresses through (PENDING -> CONFIRMED -> SHIPPED -> DELIVERED),
 * or CANCELLED by the buyer while still PENDING.
 */
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed
    private String sellerId;

    @Indexed
    private String buyerId;

    /** Optional link back to the conversation that led to this order. */
    private String conversationId;

    private String productName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;

    private String deliveryMethod; // "DELIVERY" | "PICKUP" | null/UNSPECIFIED
    private String deliveryAddress;
    private String buyerNotes;

    private OrderStatus status = OrderStatus.PENDING;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Order() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}