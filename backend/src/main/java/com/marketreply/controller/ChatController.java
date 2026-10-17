package com.marketreply.controller;

import com.marketreply.dto.ChatRequestDTO;
import com.marketreply.dto.ChatSummaryDTO;
import com.marketreply.dto.ChatViewDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** The AI shopping assistant: negotiate, ask questions and place the order in one conversation. */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /** Open (or resume) the chat for a product. */
    @PostMapping("/start")
    public ResponseEntity<ChatViewDTO> start(@RequestBody ChatRequestDTO body,
                                             @RequestParam(defaultValue = "false") boolean fresh,
                                             HttpServletRequest request) {
        if (body.getSellerId() == null || body.getSellerId().isBlank()) {
            throw new InvalidRequestException("sellerId is required");
        }
        return ResponseEntity.ok(chatService.start(userId(request), body.getSellerId(), fresh));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatViewDTO> message(@RequestBody ChatRequestDTO body, HttpServletRequest request) {
        return ResponseEntity.ok(chatService.send(userId(request), body.getSessionId(), body.getMessage()));
    }

    @PostMapping("/{sessionId}/confirm")
    public ResponseEntity<ChatViewDTO> confirm(@PathVariable String sessionId, HttpServletRequest request) {
        return ResponseEntity.ok(chatService.confirm(userId(request), sessionId));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ChatViewDTO> get(@PathVariable String sessionId, HttpServletRequest request) {
        return ResponseEntity.ok(chatService.get(userId(request), sessionId));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSummaryDTO>> sessions(HttpServletRequest request) {
        return ResponseEntity.ok(chatService.listFor(userId(request)));
    }

    private String userId(HttpServletRequest request) {
        return (String) request.getAttribute("authUserId");
    }
}
