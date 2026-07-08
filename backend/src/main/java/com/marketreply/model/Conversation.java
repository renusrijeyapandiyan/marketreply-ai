package com.marketreply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

/**
 * A single buyer-message -> AI-analysis -> reply exchange, persisted so
 * sellers can review their history and analytics can be computed from it.
 */
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    @Indexed
    private String sellerId;

    private String buyerMessage;
    private AIAnalysis aiAnalysis;
    private String finalReply;
    private Instant createdAt = Instant.now();

    public Conversation() {
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

    public String getBuyerMessage() {
        return buyerMessage;
    }

    public void setBuyerMessage(String buyerMessage) {
        this.buyerMessage = buyerMessage;
    }

    public AIAnalysis getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(AIAnalysis aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public String getFinalReply() {
        return finalReply;
    }

    public void setFinalReply(String finalReply) {
        this.finalReply = finalReply;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
