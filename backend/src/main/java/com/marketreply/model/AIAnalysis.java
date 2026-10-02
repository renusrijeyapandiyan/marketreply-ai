package com.marketreply.model;

import java.util.List;

/**
 * The structured result Gemini returns after analyzing a buyer message
 * against a seller's rules. Embedded inside Conversation.
 */
public class AIAnalysis {

    private String intent;                 // e.g. NEGOTIATE_PRICE, ASK_DELIVERY, ASK_AVAILABILITY
    private Double offeredPrice;
    private String requestedPaymentMethod;
    private String requestedDeliveryMethod; // DELIVERY, PICKUP, UNSPECIFIED
    private String requestedDeliveryTime;
    private List<String> extractedEntities;
    private List<String> ruleViolations;
    private Boolean compliesWithRules;
    private String sentiment;              // POSITIVE, NEUTRAL, NEGATIVE
    private String suggestedReply;

    public AIAnalysis() {
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public Double getOfferedPrice() {
        return offeredPrice;
    }

    public void setOfferedPrice(Double offeredPrice) {
        this.offeredPrice = offeredPrice;
    }

    public String getRequestedPaymentMethod() {
        return requestedPaymentMethod;
    }

    public void setRequestedPaymentMethod(String requestedPaymentMethod) {
        this.requestedPaymentMethod = requestedPaymentMethod;
    }

    public String getRequestedDeliveryMethod() {
        return requestedDeliveryMethod;
    }

    public void setRequestedDeliveryMethod(String requestedDeliveryMethod) {
        this.requestedDeliveryMethod = requestedDeliveryMethod;
    }

    public String getRequestedDeliveryTime() {
        return requestedDeliveryTime;
    }

    public void setRequestedDeliveryTime(String requestedDeliveryTime) {
        this.requestedDeliveryTime = requestedDeliveryTime;
    }

    public List<String> getExtractedEntities() {
        return extractedEntities;
    }

    public void setExtractedEntities(List<String> extractedEntities) {
        this.extractedEntities = extractedEntities;
    }

    public List<String> getRuleViolations() {
        return ruleViolations;
    }

    public void setRuleViolations(List<String> ruleViolations) {
        this.ruleViolations = ruleViolations;
    }

    public Boolean getCompliesWithRules() {
        return compliesWithRules;
    }

    public void setCompliesWithRules(Boolean compliesWithRules) {
        this.compliesWithRules = compliesWithRules;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public String getSuggestedReply() {
        return suggestedReply;
    }

    public void setSuggestedReply(String suggestedReply) {
        this.suggestedReply = suggestedReply;
    }
}
