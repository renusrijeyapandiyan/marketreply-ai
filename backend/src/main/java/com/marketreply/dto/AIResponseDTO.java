package com.marketreply.dto;

import com.marketreply.model.AIAnalysis;

/**
 * Response returned to the frontend after Gemini analyzes a buyer message:
 * the structured analysis plus the persisted conversation id.
 */
public class AIResponseDTO {

    private String conversationId;
    private AIAnalysis analysis;

    public AIResponseDTO() {
    }

    public AIResponseDTO(String conversationId, AIAnalysis analysis) {
        this.conversationId = conversationId;
        this.analysis = analysis;
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
}
