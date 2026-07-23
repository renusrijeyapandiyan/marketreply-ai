package com.marketreply.model;

import java.util.List;

public class AIAnalysis {

    private String intent;
    private Double offeredPrice;
    private String requestedPaymentMethod;
    private String requestedDeliveryMethod;
    private String requestedDeliveryTime;
    private List<String> extractedEntities;
    private List<String> ruleViolations;
    private Boolean compliesWithRules;
    private String sentiment;
    private String suggestedReply;

    /** True only when the buyer has just given a clear, explicit purchase confirmation. */
    private Boolean orderReady;

    /** Buyer's delivery address, if mentioned anywhere in the conversation. */
    private String deliveryAddress;

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

    public Boolean getOrderReady() {
        return orderReady;
    }

    public void setOrderReady(Boolean orderReady) {
        this.orderReady = orderReady;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}