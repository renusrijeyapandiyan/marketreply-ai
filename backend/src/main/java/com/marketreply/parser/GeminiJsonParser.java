package com.marketreply.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.marketreply.model.AIAnalysis;
import com.marketreply.util.JsonUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Parses the raw text Gemini returns (expected to be a JSON object matching
 * PromptConstants.OUTPUT_CONTRACT) into an AIAnalysis object, tolerating
 * missing fields and minor formatting quirks.
 */
public class GeminiJsonParser {

    public AIAnalysis parse(String rawText) {
        try {
            String cleaned = JsonUtil.stripCodeFences(rawText);
            JsonNode root = JsonUtil.mapper().readTree(cleaned);

            AIAnalysis analysis = new AIAnalysis();
            analysis.setIntent(textOrNull(root, "intent"));
            analysis.setOfferedPrice(root.hasNonNull("offeredPrice") ? root.get("offeredPrice").asDouble() : null);
            analysis.setRequestedPaymentMethod(textOrNull(root, "requestedPaymentMethod"));
            analysis.setRequestedDeliveryMethod(
                    root.hasNonNull("requestedDeliveryMethod") ? root.get("requestedDeliveryMethod").asText() : "UNSPECIFIED");
            analysis.setRequestedDeliveryTime(textOrNull(root, "requestedDeliveryTime"));
            analysis.setExtractedEntities(toList(root.get("extractedEntities")));
            analysis.setRuleViolations(toList(root.get("ruleViolations")));
            analysis.setCompliesWithRules(root.hasNonNull("compliesWithRules") && root.get("compliesWithRules").asBoolean());
            analysis.setSentiment(root.hasNonNull("sentiment") ? root.get("sentiment").asText() : "NEUTRAL");
            analysis.setSuggestedReply(textOrNull(root, "suggestedReply"));

            return analysis;
        } catch (Exception e) {
            // Fall back gracefully so a single malformed AI response never 500s the API.
            AIAnalysis fallback = new AIAnalysis();
            fallback.setIntent("OTHER");
            fallback.setRequestedDeliveryMethod("UNSPECIFIED");
            fallback.setSentiment("NEUTRAL");
            fallback.setCompliesWithRules(false);
            fallback.setExtractedEntities(new ArrayList<>());
            fallback.setRuleViolations(List.of("Could not parse AI response: " + e.getMessage()));
            fallback.setSuggestedReply(
                    "Thanks for your message! Let me check the details and get back to you shortly.");
            return fallback;
        }
    }

    private String textOrNull(JsonNode root, String field) {
        return root.hasNonNull(field) ? root.get(field).asText() : null;
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(n.asText()));
        }
        return list;
    }
}
