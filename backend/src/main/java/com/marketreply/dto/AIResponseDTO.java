package com.marketreply.dto;

import com.marketreply.model.AIAnalysis;

public class AIResponseDTO {

    private String conversationId;
    private AIAnalysis analysis;
    private String orderId;

    public AIResponseDTO() {
    }

    public AIResponseDTO(String conversationId, AIAnalysis analysis) {
        this.conversationId = conversationId;
        this.analysis = analysis;
    }

    public AIResponseDTO(String conversationId, AIAnalysis analysis, String orderId) {
        this.conversationId = conversationId;
        this.analysis = analysis;
        this.orderId = orderId;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public AIAnalysis getAnalysis() {
        return analysis;
    }

    public void setAnalysis(AIAnalysis analysis) {
        this.analysis = analysis;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}