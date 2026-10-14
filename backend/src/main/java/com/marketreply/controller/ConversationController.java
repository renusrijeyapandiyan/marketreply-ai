package com.marketreply.controller;

import com.marketreply.dto.ConversationDTO;
import com.marketreply.dto.SellerDashboardDTO;
import com.marketreply.service.DashboardService;
import com.marketreply.service.ConversationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Read endpoints for conversation history and dashboard analytics, scoped to the authenticated user. */
@RestController
@RequestMapping("/api")
public class ConversationController {

    private final ConversationService conversationService;
    private final DashboardService dashboardService;

    public ConversationController(ConversationService conversationService, DashboardService dashboardService) {
        this.conversationService = conversationService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getHistory(
            @RequestParam(required = false) String sellerId, HttpServletRequest request) {
        return ResponseEntity.ok(conversationService.getHistory(ownerId(request), sellerId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationDTO> getConversation(@PathVariable String id, HttpServletRequest request) {
        return ResponseEntity.ok(conversationService.getConversation(ownerId(request), id));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<SellerDashboardDTO> getDashboard(HttpServletRequest request) {
        return ResponseEntity.ok(dashboardService.forSeller(ownerId(request)));
    }

    private String ownerId(HttpServletRequest request) {
        return (String) request.getAttribute("authUserId");
    }
}
