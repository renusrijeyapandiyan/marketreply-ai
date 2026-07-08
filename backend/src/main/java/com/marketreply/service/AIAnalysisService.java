package com.marketreply.service;

import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Seller;
import com.marketreply.parser.GeminiJsonParser;
import org.springframework.stereotype.Service;

/**
 * Orchestrates building the prompt, calling Gemini, and parsing the result
 * into a structured AIAnalysis object.
 */
@Service
public class AIAnalysisService {

    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;
    private final GeminiJsonParser parser = new GeminiJsonParser();

    public AIAnalysisService(PromptBuilderService promptBuilderService, GeminiService geminiService) {
        this.promptBuilderService = promptBuilderService;
        this.geminiService = geminiService;
    }

    public AIAnalysis analyze(Seller seller, String buyerMessage) {
        String prompt = promptBuilderService.buildPrompt(seller, buyerMessage);
        String rawResponse = geminiService.generateContent(prompt);
        return parser.parse(rawResponse);
    }
}
