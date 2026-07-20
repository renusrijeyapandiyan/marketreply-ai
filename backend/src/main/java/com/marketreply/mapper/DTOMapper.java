package com.marketreply.mapper;

import com.marketreply.dto.ConversationDTO;
import com.marketreply.dto.SellerDTO;
import com.marketreply.model.Conversation;
import com.marketreply.model.Seller;

/**
 * Hand-written mappers between persistence models and API DTOs.
 * Kept simple and dependency-free (no MapStruct) for easy readability.
 */
public class DTOMapper {

    private DTOMapper() {
    }

    public static Seller toEntity(SellerDTO dto) {
        Seller seller = new Seller();
        seller.setId(dto.getId());
        seller.setName(dto.getName());
        seller.setEmail(dto.getEmail());
        seller.setProductName(dto.getProductName());
        seller.setProductDescription(dto.getProductDescription());
        seller.setListedPrice(dto.getListedPrice());
        seller.setProductSize(dto.getProductSize());
        seller.setProductImages(dto.getProductImages());
        seller.setRules(dto.getRules());
        return seller;
    }

    public static SellerDTO toDTO(Seller seller) {
        SellerDTO dto = new SellerDTO();
        dto.setId(seller.getId());
        dto.setName(seller.getName());
        dto.setEmail(seller.getEmail());
        dto.setProductName(seller.getProductName());
        dto.setProductDescription(seller.getProductDescription());
        dto.setListedPrice(seller.getListedPrice());
        dto.setProductSize(seller.getProductSize());
        dto.setProductImages(seller.getProductImages());
        dto.setRules(seller.getRules());
        return dto;
    }

    public static ConversationDTO toDTO(Conversation conversation, String sellerName) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        dto.setSellerId(conversation.getSellerId());
        dto.setSellerName(sellerName);
        dto.setBuyerId(conversation.getBuyerId());
        dto.setBuyerMessage(conversation.getBuyerMessage());
        dto.setAiAnalysis(conversation.getAiAnalysis());
        dto.setFinalReply(conversation.getFinalReply());
        dto.setCreatedAt(conversation.getCreatedAt());
        return dto;
    }
}