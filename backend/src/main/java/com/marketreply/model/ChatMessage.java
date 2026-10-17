package com.marketreply.model;

import java.time.Instant;

/** One turn of a negotiation chat. role is "BUYER" or "AI". Embedded inside ChatSession. */
public class ChatMessage {

    private String role;
    private String text;
    private Instant createdAt = Instant.now();

    public ChatMessage() {
    }

    public ChatMessage(String role, String text) {
        this.role = role;
        this.text = text;
        this.createdAt = Instant.now();
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
