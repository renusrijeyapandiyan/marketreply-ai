package com.marketreply.mapper;

import com.marketreply.dto.ConversationDTO;
import com.marketreply.dto.SellerDTO;
import com.marketreply.model.Conversation;
import com.marketreply.model.Seller;
import com.marketreply.dto.OrderDTO;
import com.marketreply.model.Order;

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
        dto.setRules(seller.getRules());
        dto.setProductImages(seller.getProductImages());
        if (seller.getProductImages() != null && !seller.getProductImages().isEmpty()) {
            dto.setThumbnailImage(seller.getProductImages().get(0));
        }
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

    public static OrderDTO toDTO(Order order, String sellerName, String buyerName) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setSellerId(order.getSellerId());
        dto.setSellerName(sellerName);
        dto.setBuyerId(order.getBuyerId());
        dto.setBuyerName(buyerName);
        dto.setConversationId(order.getConversationId());
        dto.setProductName(order.getProductName());
        dto.setQuantity(order.getQuantity());
        dto.setUnitPrice(order.getUnitPrice());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setDeliveryMethod(order.getDeliveryMethod());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setBuyerNotes(order.getBuyerNotes());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}