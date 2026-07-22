package com.marketreply.controller;

import com.marketreply.dto.AIResponseDTO;
import com.marketreply.dto.BuyerMessageRequest;
import com.marketreply.service.ConversationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

/** Endpoint the Buyer Analyzer page calls to get an AI-drafted reply. */
@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final ConversationService conversationService;

    public AIController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AIResponseDTO> analyze(@Valid @RequestBody BuyerMessageRequest request,
                                                  HttpServletRequest httpRequest) {
        String ownerId = (String) httpRequest.getAttribute("authUserId");
        var history = request.getHistory() != null ? request.getHistory() : Collections.<com.marketreply.dto.ChatTurnDTO>emptyList();
        AIResponseDTO response = conversationService.analyzeAndSave(
                ownerId, request.getSellerId(), request.getMessage(), history);
        return ResponseEntity.ok(response);
    }
}