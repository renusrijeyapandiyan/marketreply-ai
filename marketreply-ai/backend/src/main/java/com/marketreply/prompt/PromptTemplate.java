package com.marketreply.prompt;

/** Simple immutable holder for a fully-rendered prompt string. */
public class PromptTemplate {

    private final String content;

    public PromptTemplate(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }
}
