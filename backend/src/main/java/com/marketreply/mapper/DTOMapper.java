package com.marketreply.mapper;

import com.marketreply.dto.ConversationDTO;
import com.marketreply.dto.ProductPublicDTO;
import com.marketreply.dto.SellerDTO;
import com.marketreply.model.SellerRule;
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
        seller.setCategory(dto.getCategory());
        seller.setStock(dto.getStock());
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
        dto.setCategory(seller.getCategory());
        dto.setStock(seller.getStock());
        dto.setProductImages(seller.getProductImages());
        dto.setRules(seller.getRules());
        return dto;
    }

    /** Buyer-safe view: never includes the minimum price, max discount, style or private notes. */
    public static ProductPublicDTO toPublicDTO(Seller seller, boolean includeAllImages) {
        ProductPublicDTO dto = new ProductPublicDTO();
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        dto.setId(seller.getId());
        dto.setSellerName(seller.getName());
        dto.setProductName(seller.getProductName());
        dto.setProductDescription(seller.getProductDescription());
        dto.setCategory(seller.getCategory());
        dto.setListedPrice(seller.getListedPrice());
        dto.setStock(seller.getStock());
        boolean negotiable = r.getMinPrice() != null && seller.getListedPrice() != null
                && r.getMinPrice() < seller.getListedPrice();
        dto.setNegotiable(negotiable);
        java.util.List<String> images = seller.getProductImages();
        if (images != null && !images.isEmpty()) {
            dto.setThumbnail(images.get(0));
            if (includeAllImages) {
                dto.setProductImages(images);
            }
        }
        dto.setDeliveryAvailable(Boolean.TRUE.equals(r.getDeliveryAvailable()));
        dto.setPickupAvailable(Boolean.TRUE.equals(r.getPickupAvailable()));
        dto.setDeliveryCharge(r.getDeliveryCharge());
        dto.setFreeDeliveryAbove(r.getFreeDeliveryAbove());
        dto.setEstimatedDeliveryDays(r.getEstimatedDeliveryDays());
        dto.setDeliveryLocations(r.getDeliveryLocations());
        dto.setPickupAddress(r.getPickupAddress());
        dto.setAcceptedPaymentMethods(r.getAcceptedPaymentMethods());
        dto.setReturnPolicy(r.getReturnPolicy());
        dto.setWarranty(r.getWarranty());
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
        dto.setListedPrice(order.getListedPrice());
        dto.setDeliveryCharge(order.getDeliveryCharge());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setBuyerPhone(order.getBuyerPhone());
        dto.setSubtotal(order.getUnitPrice() * order.getQuantity());
        dto.setNegotiated(order.getListedPrice() > 0 && order.getUnitPrice() < order.getListedPrice());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}
