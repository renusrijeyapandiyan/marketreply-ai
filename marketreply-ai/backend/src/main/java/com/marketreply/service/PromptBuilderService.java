package com.marketreply.service;

import com.marketreply.model.Seller;
import com.marketreply.prompt.PromptBuilder;
import com.marketreply.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

/** Thin service wrapper around PromptBuilder so it can be injected/mocked. */
@Service
public class PromptBuilderService {

    private final PromptBuilder promptBuilder = new PromptBuilder();

    public String buildPrompt(Seller seller, String buyerMessage) {
        PromptTemplate template = promptBuilder.build(seller, buyerMessage);
        return template.getContent();
    }
}
