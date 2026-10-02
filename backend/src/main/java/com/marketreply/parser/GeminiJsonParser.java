package com.marketreply.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.marketreply.model.AIAnalysis;
import com.marketreply.util.JsonRepair;
import com.marketreply.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Parses the raw text Gemini returns (expected to be a JSON object matching
 * the schema in PromptConstants.OUTPUT_CONTRACT) into an AIAnalysis object.
 *
 * It tolerates code fences, prose around the JSON, truncated JSON (repaired via
 * JsonRepair), missing fields and out-of-range enum values.
 *
 * It returns null (instead of a fake "error" analysis) when nothing usable was
 * found, so the caller can retry or use the rule-based fallback. Technical
 * parse errors are only logged - they are never shown to the buyer/seller.
 */
public class GeminiJsonParser {

    private static final Logger log = LoggerFactory.getLogger(GeminiJsonParser.class);

    private static final Set<String> INTENTS = Set.of(
            "NEGOTIATE_PRICE", "ASK_DELIVERY", "ASK_AVAILABILITY", "ASK_PAYMENT",
            "CONFIRM_PURCHASE", "GENERAL_QUESTION", "OTHER");
    private static final Set<String> DELIVERY_METHODS = Set.of("DELIVERY", "PICKUP", "UNSPECIFIED");
    private static final Set<String> SENTIMENTS = Set.of("POSITIVE", "NEUTRAL", "NEGATIVE");

    /** @return the parsed analysis (suggestedReply may be null if it was cut off), or null if unusable. */
    public AIAnalysis tryParse(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return null;
        }

        String candidate = JsonUtil.extractJsonObject(rawText);
        JsonNode root = read(candidate);

        if (root == null || !root.isObject()) {
            root = read(JsonRepair.repairTruncatedJson(candidate));
            if (root != null && root.isObject()) {
                log.warn("Gemini JSON was truncated/malformed and had to be repaired. Raw: {}", abbreviate(rawText));
            }
        }

        if (root == null || !root.isObject()) {
            log.warn("Could not parse Gemini output as JSON. Raw: {}", abbreviate(rawText));
            return null;
        }

        AIAnalysis a = new AIAnalysis();
        a.setIntent(normalize(text(root, "intent"), INTENTS, "OTHER"));
        a.setOfferedPrice(number(root, "offeredPrice"));
        a.setRequestedPaymentMethod(text(root, "requestedPaymentMethod"));
        a.setRequestedDeliveryMethod(normalize(text(root, "requestedDeliveryMethod"), DELIVERY_METHODS, "UNSPECIFIED"));
        a.setRequestedDeliveryTime(text(root, "requestedDeliveryTime"));
        a.setExtractedEntities(toList(root.get("extractedEntities")));
        a.setRuleViolations(toList(root.get("ruleViolations")));
        a.setCompliesWithRules(bool(root, "compliesWithRules"));
        a.setSentiment(normalize(text(root, "sentiment"), SENTIMENTS, "NEUTRAL"));
        a.setSuggestedReply(text(root, "suggestedReply"));
        return a;
    }

    // ------------------------------------------------------------------------

    private JsonNode read(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return JsonUtil.mapper().readTree(json);
        } catch (Exception e) {
            return null;
        }
    }

    private String text(JsonNode root, String field) {
        if (!root.hasNonNull(field)) {
            return null;
        }
        String value = root.get(field).asText().trim();
        return (value.isEmpty() || value.equalsIgnoreCase("null")) ? null : value;
    }

    private Double number(JsonNode root, String field) {
        if (!root.hasNonNull(field)) {
            return null;
        }
        JsonNode n = root.get(field);
        if (n.isNumber()) {
            return n.asDouble();
        }
        String digits = n.asText().replaceAll("[^0-9.]", "");
        if (digits.isEmpty() || digits.equals(".")) {
            return null;
        }
        try {
            return Double.parseDouble(digits);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean bool(JsonNode root, String field) {
        if (!root.hasNonNull(field)) {
            return false;
        }
        JsonNode n = root.get(field);
        return n.isBoolean() ? n.asBoolean() : "true".equalsIgnoreCase(n.asText().trim());
    }

    private String normalize(String value, Set<String> allowed, String defaultValue) {
        if (value == null) {
            return defaultValue;
        }
        String v = value.trim().toUpperCase().replace(' ', '_').replace('-', '_');
        return allowed.contains(v) ? v : defaultValue;
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(n -> {
                String s = n.asText().trim();
                if (!s.isEmpty()) {
                    list.add(s);
                }
            });
        }
        return list;
    }

    private String abbreviate(String s) {
        String flat = s.replace('\n', ' ');
        return flat.length() > 600 ? flat.substring(0, 600) + "..." : flat;
    }
}