package com.marketreply.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.marketreply.config.GeminiConfig;
import com.marketreply.exception.GeminiException;
import com.marketreply.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;

    public GeminiService(WebClient geminiWebClient, GeminiConfig geminiConfig) {
        this.geminiWebClient = geminiWebClient;
        this.geminiConfig = geminiConfig;
    }

    public String generateContent(String prompt) {
        String apiKey = geminiConfig.getApiKey();
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("your-gemini-api-key")) {
            throw new GeminiException(
                    "GEMINI_API_KEY is not configured. Set the GEMINI_API_KEY environment variable on your server.",
                    0, false);
        }

        List<String> models = new ArrayList<>();
        models.add(geminiConfig.getModel());
        String fallback = geminiConfig.getFallbackModel();
        if (fallback != null && !fallback.isBlank() && !fallback.equals(geminiConfig.getModel())) {
            models.add(fallback);
        }

        GeminiException last = null;
        for (String model : models) {
            boolean withSchema = true;
            int maxAttempts = Math.max(1, geminiConfig.getMaxRetries() + 1);

            for (int attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return callOnce(model, prompt, withSchema);
                } catch (GeminiException e) {
                    last = e;
                    log.warn("Gemini call failed (model={}, attempt={}/{}, schema={}): {}",
                            model, attempt, maxAttempts, withSchema, e.getMessage());

                    if (e.getStatus() == 400 && withSchema) {
                        withSchema = false;
                        attempt--;
                        continue;
                    }
                    if (!e.isRetryable()) {
                        break;
                    }
                    sleep(700L * attempt);
                }
            }
        }
        throw last != null ? last : new GeminiException("Gemini call failed", 0, false);
    }

    private String callOnce(String model, String prompt, boolean withSchema) {
        JsonNode response = post(model, buildRequestBody(model, prompt, withSchema));
        return extractText(response);
    }

    private Map<String, Object> buildRequestBody(String model, String prompt, boolean withSchema) {
        Map<String, Object> generationConfig = new LinkedHashMap<>();
        generationConfig.put("temperature", 0.3);
        generationConfig.put("responseMimeType", "application/json");
        if (withSchema) {
            generationConfig.put("responseSchema", responseSchema());
        }

        int maxTokens = geminiConfig.getMaxOutputTokens();
        if (canDisableThinking(model)) {
            generationConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));
        } else {
            maxTokens = Math.max(maxTokens, 8192);
        }
        generationConfig.put("maxOutputTokens", maxTokens);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))));
        body.put("generationConfig", generationConfig);
        return body;
    }

    private static boolean canDisableThinking(String model) {
        String m = model == null ? "" : model.toLowerCase();
        return m.contains("2.5") && m.contains("flash");
    }

    private JsonNode post(String model, Map<String, Object> body) {
        try {
            return geminiWebClient.post()
                    .uri("/models/{model}:generateContent", model)
                    .header("x-goog-api-key", geminiConfig.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block(Duration.ofSeconds(Math.max(5, geminiConfig.getTimeoutSeconds())));
        } catch (WebClientResponseException e) {
            int status = e.getStatusCode().value();
            String responseBody = e.getResponseBodyAsString();
            if (responseBody != null && responseBody.length() > 400) {
                responseBody = responseBody.substring(0, 400) + "...";
            }
            throw new GeminiException("Gemini HTTP " + status + ": " + responseBody,
                    status, status == 429 || status >= 500);
        } catch (RuntimeException e) {
            throw new GeminiException("Gemini request failed: " + e.getMessage(), 0, true);
        }
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            throw new GeminiException("Gemini returned an empty response", 0, true);
        }

        JsonNode blockReason = response.path("promptFeedback").path("blockReason");
        if (!blockReason.isMissingNode() && !blockReason.isNull()) {
            throw new GeminiException("Gemini blocked the prompt: " + blockReason.asText(), 0, false);
        }

        JsonNode candidates = response.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new GeminiException("Gemini returned no candidates", 0, true);
        }

        JsonNode candidate = candidates.get(0);
        String finishReason = candidate.path("finishReason").asText("");
        if (!finishReason.isEmpty() && !"STOP".equals(finishReason)) {
            log.warn("Gemini finishReason={} (output may be incomplete)", finishReason);
        }

        StringBuilder text = new StringBuilder();
        JsonNode parts = candidate.path("content").path("parts");
        if (parts.isArray()) {
            for (JsonNode part : parts) {
                if (part.path("thought").asBoolean(false)) {
                    continue;
                }
                if (part.hasNonNull("text")) {
                    text.append(part.get("text").asText());
                }
            }
        }

        if (text.toString().isBlank()) {
            throw new GeminiException("Gemini returned no text (finishReason=" + finishReason + ")", 0, true);
        }
        return text.toString();
    }

    private static Map<String, Object> responseSchema() {
        Map<String, Object> props = new LinkedHashMap<>();
        props.put("intent", Map.of("type", "STRING", "enum", List.of(
                "NEGOTIATE_PRICE", "ASK_DELIVERY", "ASK_AVAILABILITY", "ASK_PAYMENT",
                "CONFIRM_PURCHASE", "GENERAL_QUESTION", "OTHER")));
        props.put("offeredPrice", Map.of("type", "NUMBER", "nullable", true));
        props.put("requestedPaymentMethod", Map.of("type", "STRING", "nullable", true));
        props.put("requestedDeliveryMethod", Map.of("type", "STRING", "enum",
                List.of("DELIVERY", "PICKUP", "UNSPECIFIED")));
        props.put("requestedDeliveryTime", Map.of("type", "STRING", "nullable", true));
        props.put("extractedEntities", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")));
        props.put("ruleViolations", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")));
        props.put("compliesWithRules", Map.of("type", "BOOLEAN"));
        props.put("sentiment", Map.of("type", "STRING", "enum", List.of("POSITIVE", "NEUTRAL", "NEGATIVE")));
        props.put("suggestedReply", Map.of("type", "STRING"));

        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "OBJECT");
        schema.put("properties", props);
        schema.put("required", List.of(
                "intent", "requestedDeliveryMethod", "extractedEntities", "ruleViolations",
                "compliesWithRules", "sentiment", "suggestedReply"));
        schema.put("propertyOrdering", new ArrayList<>(props.keySet()));
        return schema;
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }

    public com.fasterxml.jackson.databind.ObjectMapper mapper() {
        return JsonUtil.mapper();
    }
}