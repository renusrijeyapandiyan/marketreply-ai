package com.marketreply.service;

import com.marketreply.dto.OrderDTO;
import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Order;
import com.marketreply.model.Seller;
import com.marketreply.repository.OrderRepository;
import com.marketreply.repository.SellerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;

    public OrderService(OrderRepository orderRepository, SellerRepository sellerRepository) {
        this.orderRepository = orderRepository;
        this.sellerRepository = sellerRepository;
    }

    /** Called by ConversationService right after Gemini flags orderReady=true on a turn. */
    public Order createFromConversation(String buyerId, String sellerId, String conversationId,
                                         Seller seller, AIAnalysis analysis) {
        Order order = new Order();
        order.setSellerId(sellerId);
        order.setBuyerId(buyerId);
        order.setConversationId(conversationId);
        order.setProductName(seller.getProductName());
        order.setAgreedPrice(analysis.getOfferedPrice() != null ? analysis.getOfferedPrice() : seller.getListedPrice());
        order.setDeliveryMethod(analysis.getRequestedDeliveryMethod());
        order.setDeliveryAddress(analysis.getDeliveryAddress());
        order.setPaymentMethod(analysis.getRequestedPaymentMethod());
        order.setStatus("CONFIRMED");
        order.setCreatedAt(Instant.now());
        return orderRepository.save(order);
    }

    /** Every order the user can see: ones placed on listings they own, plus ones they placed as a buyer. */
    public java.util.List<OrderDTO> getOrdersForUser(String userId) {
        Set<String> ownedSellerIds = new HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(userId)) {
            ownedSellerIds.add(s.getId());
        }

        Map<String, Order> byId = new LinkedHashMap<>();
        for (Order o : orderRepository.findBySellerIdInOrderByCreatedAtDesc(ownedSellerIds)) {
            byId.put(o.getId(), o);
        }
        for (Order o : orderRepository.findByBuyerIdOrderByCreatedAtDesc(userId)) {
            byId.putIfAbsent(o.getId(), o);
        }

        Map<String, String> sellerNameCache = new HashMap<>();
        return byId.values().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(o -> toDTO(o, ownedSellerIds, sellerNameCache))
                .toList();
    }

    private OrderDTO toDTO(Order order, Set<String> ownedSellerIds, Map<String, String> sellerNameCache) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setSellerId(order.getSellerId());
        dto.setSellerName(sellerNameCache.computeIfAbsent(order.getSellerId(),
                id -> sellerRepository.findById(id).map(Seller::getName).orElse("Unknown")));
        dto.setBuyerId(order.getBuyerId());
        dto.setConversationId(order.getConversationId());
        dto.setProductName(order.getProductName());
        dto.setAgreedPrice(order.getAgreedPrice());
        dto.setDeliveryMethod(order.getDeliveryMethod());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setRole(ownedSellerIds.contains(order.getSellerId()) ? "SELLER" : "BUYER");
        return dto;
    }
}