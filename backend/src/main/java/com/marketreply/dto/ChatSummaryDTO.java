package com.marketreply.dto;

import java.time.Instant;

/** One row in a conversations list (seller view or buyer view). */
public class ChatSummaryDTO {

    private String id;
    private String sellerId;
    private String productName;
    private String buyerName;
    private String lastMessage;
    private String stage;
    private Double listedPrice;
    private Double agreedPrice;
    private int messageCount;
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Double getListedPrice() { return listedPrice; }
    public void setListedPrice(Double listedPrice) { this.listedPrice = listedPrice; }

    public Double getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(Double agreedPrice) { this.agreedPrice = agreedPrice; }

    public int getMessageCount() { return messageCount; }
    public void setMessageCount(int messageCount) { this.messageCount = messageCount; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
