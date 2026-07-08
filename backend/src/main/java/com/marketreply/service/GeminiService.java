package com.marketreply.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.marketreply.config.GeminiConfig;
import com.marketreply.util.JsonUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * Thin client around Google's Generative Language API (Gemini). Sends a
 * plain-text prompt and returns the model's raw text response.
 */
@Service
public class GeminiService {

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;

    public GeminiService(WebClient geminiWebClient, GeminiConfig geminiConfig) {
        this.geminiWebClient = geminiWebClient;
        this.geminiConfig = geminiConfig;
    }

    /**
     * Calls generateContent on the configured Gemini model with the given
     * prompt and returns the concatenated text of the first candidate.
     */
    public String generateContent(String prompt) {
        String path = String.format("/models/%s:generateContent?key=%s",
                geminiConfig.getModel(), geminiConfig.getApiKey());

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "maxOutputTokens", 1024
                )
        );

        JsonNode response = geminiWebClient.post()
                .uri(path)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return extractText(response);
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            return "";
        }
        JsonNode candidates = response.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            return "";
        }
        JsonNode parts = candidates.get(0).path("content").path("parts");
        StringBuilder text = new StringBuilder();
        if (parts.isArray()) {
            for (JsonNode part : parts) {
                if (part.hasNonNull("text")) {
                    text.append(part.get("text").asText());
                }
            }
        }
        return text.toString();
    }

    public com.fasterxml.jackson.databind.ObjectMapper mapper() {
        return JsonUtil.mapper();
    }
}
