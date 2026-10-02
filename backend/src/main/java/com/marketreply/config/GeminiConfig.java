package com.marketreply.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {

    private String apiKey;
    private String model = "gemini-2.5-flash";
    private String fallbackModel = "gemini-2.5-flash-lite";
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    private int maxOutputTokens = 4096;
    private int timeoutSeconds = 15;
    private int maxRetries = 1;

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getFallbackModel() { return fallbackModel; }
    public void setFallbackModel(String fallbackModel) { this.fallbackModel = fallbackModel; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public int getMaxOutputTokens() { return maxOutputTokens; }
    public void setMaxOutputTokens(int maxOutputTokens) { this.maxOutputTokens = maxOutputTokens; }
    public int getTimeoutSeconds() { return timeoutSeconds; }
    public void setTimeoutSeconds(int timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }
    public int getMaxRetries() { return maxRetries; }
    public void setMaxRetries(int maxRetries) { this.maxRetries = maxRetries; }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();
    }
}