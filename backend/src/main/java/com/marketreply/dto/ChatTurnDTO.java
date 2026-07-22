package com.marketreply.dto;

/**
 * One prior turn in an ongoing buyer/seller conversation, sent by the
 * frontend purely as context for Gemini's prompt. Never persisted directly —
 * only the current turn's buyerMessage gets saved via Conversation.
 */
public class ChatTurnDTO {

    private String buyerMessage;
    private String suggestedReply;

    public String getBuyerMessage() {
        return buyerMessage;
    }

    public void setBuyerMessage(String buyerMessage) {
        this.buyerMessage = buyerMessage;
    }

    public String getSuggestedReply() {
        return suggestedReply;
    }

    public void setSuggestedReply(String suggestedReply) {
        this.suggestedReply = suggestedReply;
    }
}