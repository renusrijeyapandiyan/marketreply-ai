package com.marketreply.dto;

import java.util.List;
import java.util.Map;

/**
 * Aggregated statistics shown on the Dashboard page.
 */
public class DashboardDTO {

    private long totalConversations;
    private long totalSellers;
    private long ruleCompliantReplies;
    private long ruleViolationReplies;
    private Map<String, Long> intentBreakdown;
    private List<ConversationDTO> recentConversations;

    public long getTotalConversations() {
        return totalConversations;
    }

    public void setTotalConversations(long totalConversations) {
        this.totalConversations = totalConversations;
    }

    public long getTotalSellers() {
        return totalSellers;
    }

    public void setTotalSellers(long totalSellers) {
        this.totalSellers = totalSellers;
    }

    public long getRuleCompliantReplies() {
        return ruleCompliantReplies;
    }

    public void setRuleCompliantReplies(long ruleCompliantReplies) {
        this.ruleCompliantReplies = ruleCompliantReplies;
    }

    public long getRuleViolationReplies() {
        return ruleViolationReplies;
    }

    public void setRuleViolationReplies(long ruleViolationReplies) {
        this.ruleViolationReplies = ruleViolationReplies;
    }

    public Map<String, Long> getIntentBreakdown() {
        return intentBreakdown;
    }

    public void setIntentBreakdown(Map<String, Long> intentBreakdown) {
        this.intentBreakdown = intentBreakdown;
    }

    public List<ConversationDTO> getRecentConversations() {
        return recentConversations;
    }

    public void setRecentConversations(List<ConversationDTO> recentConversations) {
        this.recentConversations = recentConversations;
    }
}
