package com.marketreply.service;

import com.marketreply.exception.GeminiException;
import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Seller;
import com.marketreply.parser.GeminiJsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);
    private static final int MAX_PARSE_ATTEMPTS = 2;

    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;
    private final GeminiJsonParser parser = new GeminiJsonParser();
    private final RuleBasedAnalyzer ruleBasedAnalyzer = new RuleBasedAnalyzer();

    public AIAnalysisService(PromptBuilderService promptBuilderService, GeminiService geminiService) {
        this.promptBuilderService = promptBuilderService;
        this.geminiService = geminiService;
    }

    public AIAnalysis analyze(Seller seller, String buyerMessage) {
        String prompt = promptBuilderService.buildPrompt(seller, buyerMessage);

        AIAnalysis best = null;
        for (int attempt = 1; attempt <= MAX_PARSE_ATTEMPTS; attempt++) {
            String raw;
            try {
                raw = geminiService.generateContent(prompt);
            } catch (GeminiException e) {
                log.error("Gemini unavailable ({}). Using rule-based fallback.", e.getMessage());
                break;
            }

            AIAnalysis parsed = parser.tryParse(raw);
            if (parsed != null && hasText(parsed.getSuggestedReply())) {
                best = parsed;
                break;
            }
            if (parsed != null && best == null) {
                best = parsed;
            }
            log.warn("Gemini output unusable on attempt {}/{}", attempt, MAX_PARSE_ATTEMPTS);
        }

        if (best == null) {
            log.warn("Serving rule-based analysis for message: {}", abbreviate(buyerMessage));
            return ruleBasedAnalyzer.analyze(seller, buyerMessage);
        }

        if (!hasText(best.getSuggestedReply())) {
            ruleBasedAnalyzer.enforce(seller, buyerMessage, best);
            best.setSuggestedReply(ruleBasedAnalyzer.buildReply(seller, best));
            return best;
        }

        ruleBasedAnalyzer.enforce(seller, buyerMessage, best);
        return best;
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    private String abbreviate(String s) {
        if (s == null) {
            return "";
        }
        return s.length() > 120 ? s.substring(0, 120) + "..." : s;
    }
}