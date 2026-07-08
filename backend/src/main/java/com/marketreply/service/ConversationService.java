package com.marketreply.service;

import com.marketreply.dto.AIResponseDTO;
import com.marketreply.dto.ConversationDTO;
import com.marketreply.dto.DashboardDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Conversation;
import com.marketreply.model.Seller;
import com.marketreply.repository.ConversationRepository;
import com.marketreply.repository.SellerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Handles the end-to-end "analyze a buyer message" flow: runs the AI
 * analysis, persists the conversation, and exposes history/dashboard reads.
 * Everything is scoped to the authenticated user's own seller profiles.
 */
@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final SellerRepository sellerRepository;
    private final AIAnalysisService aiAnalysisService;

    public ConversationService(ConversationRepository conversationRepository,
                                SellerRepository sellerRepository,
                                AIAnalysisService aiAnalysisService) {
        this.conversationRepository = conversationRepository;
        this.sellerRepository = sellerRepository;
        this.aiAnalysisService = aiAnalysisService;
    }

    public AIResponseDTO analyzeAndSave(String ownerId, String sellerId, String buyerMessage) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + sellerId));
        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }

        AIAnalysis analysis = aiAnalysisService.analyze(seller, buyerMessage);

        Conversation conversation = new Conversation();
        conversation.setSellerId(sellerId);
        conversation.setBuyerMessage(buyerMessage);
        conversation.setAiAnalysis(analysis);
        conversation.setFinalReply(analysis.getSuggestedReply());
        conversation.setCreatedAt(Instant.now());

        Conversation saved = conversationRepository.save(conversation);
        return new AIResponseDTO(saved.getId(), analysis);
    }

    public List<ConversationDTO> getHistory(String ownerId, String sellerId) {
        Set<String> ownedSellerIds = ownedSellerIds(ownerId);

        List<Conversation> conversations;
        if (sellerId != null && !sellerId.isBlank()) {
            if (!ownedSellerIds.contains(sellerId)) {
                throw new InvalidRequestException("You do not have access to this seller profile");
            }
            conversations = conversationRepository.findBySellerId(sellerId, Sort.by(Sort.Direction.DESC, "createdAt"));
        } else {
            conversations = conversationRepository.findAllByOrderByCreatedAtDesc().stream()
                    .filter(c -> ownedSellerIds.contains(c.getSellerId()))
                    .toList();
        }

        Map<String, String> sellerNameCache = new HashMap<>();
        return conversations.stream()
                .map(c -> DTOMapper.toDTO(c, resolveSellerName(c.getSellerId(), sellerNameCache)))
                .toList();
    }

    public ConversationDTO getConversation(String ownerId, String id) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + id));
        if (!ownedSellerIds(ownerId).contains(conversation.getSellerId())) {
            throw new InvalidRequestException("You do not have access to this conversation");
        }
        return DTOMapper.toDTO(conversation, resolveSellerName(conversation.getSellerId(), new HashMap<>()));
    }

    public DashboardDTO getDashboard(String ownerId) {
        Set<String> ownedSellerIds = ownedSellerIds(ownerId);

        List<Conversation> all = conversationRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(c -> ownedSellerIds.contains(c.getSellerId()))
                .toList();

        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setTotalConversations(all.size());
        dashboard.setTotalSellers(ownedSellerIds.size());

        long compliant = all.stream()
                .filter(c -> c.getAiAnalysis() != null && Boolean.TRUE.equals(c.getAiAnalysis().getCompliesWithRules()))
                .count();
        dashboard.setRuleCompliantReplies(compliant);
        dashboard.setRuleViolationReplies(all.size() - compliant);

        Map<String, Long> intentBreakdown = new HashMap<>();
        for (Conversation c : all) {
            if (c.getAiAnalysis() != null && c.getAiAnalysis().getIntent() != null) {
                intentBreakdown.merge(c.getAiAnalysis().getIntent(), 1L, Long::sum);
            }
        }
        dashboard.setIntentBreakdown(intentBreakdown);

        Map<String, String> sellerNameCache = new HashMap<>();
        List<ConversationDTO> recent = all.stream()
                .limit(5)
                .map(c -> DTOMapper.toDTO(c, resolveSellerName(c.getSellerId(), sellerNameCache)))
                .toList();
        dashboard.setRecentConversations(recent);

        return dashboard;
    }

    private Set<String> ownedSellerIds(String ownerId) {
        Set<String> ids = new HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(ownerId)) {
            ids.add(s.getId());
        }
        return ids;
    }

    private String resolveSellerName(String sellerId, Map<String, String> cache) {
        if (sellerId == null) {
            return "Unknown";
        }
        return cache.computeIfAbsent(sellerId,
                id -> sellerRepository.findById(id).map(Seller::getName).orElse("Unknown"));
    }
}
