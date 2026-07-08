package com.marketreply.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Holds Gemini API configuration (key, model, endpoint) bound from
 * application.properties ("gemini.*") and exposes a pre-configured
 * WebClient bean used by GeminiService to call the Generative Language API.
 */
@Configuration
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {

    /** API key for the Google Generative Language API (Gemini). */
    private String apiKey;

    /** Model name, e.g. gemini-2.5-flash */
    private String model = "gemini-2.5-flash";

    /** Base URL for the Generative Language API. */
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();
    }
}
