package com.marketreply.service;

import com.marketreply.dto.ChatTurnDTO;
import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Seller;
import com.marketreply.parser.GeminiJsonParser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIAnalysisService {

    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;
    private final GeminiJsonParser parser = new GeminiJsonParser();

    public AIAnalysisService(PromptBuilderService promptBuilderService, GeminiService geminiService) {
        this.promptBuilderService = promptBuilderService;
        this.geminiService = geminiService;
    }

    public AIAnalysis analyze(Seller seller, String buyerMessage, List<ChatTurnDTO> history) {
        String prompt = promptBuilderService.buildPrompt(seller, buyerMessage, history);
        String rawResponse = geminiService.generateContent(prompt);
        return parser.parse(rawResponse);
    }
}