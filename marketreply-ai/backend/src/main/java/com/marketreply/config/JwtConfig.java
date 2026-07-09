package com.marketreply.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JWT settings bound from application.properties ("jwt.*").
 * jwt.secret should be overridden via the JWT_SECRET env var in any real deployment.
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /** HMAC signing secret. Must be at least 32 characters for HS256. */
    private String secret = "change-this-default-dev-only-secret-key-please-32chars-min";

    /** Token lifetime in milliseconds. Default: 7 days. */
    private long expirationMs = 7L * 24 * 60 * 60 * 1000;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }
}
