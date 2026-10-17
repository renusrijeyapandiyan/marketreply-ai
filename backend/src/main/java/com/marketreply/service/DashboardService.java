package com.marketreply.service;

import com.marketreply.dto.ChatSummaryDTO;
import com.marketreply.dto.OrderDTO;
import com.marketreply.dto.SellerDashboardDTO;
import com.marketreply.model.OrderStatus;
import com.marketreply.repository.SellerRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Numbers for the Seller Hub: products, orders, revenue and how much the assistant is selling. */
@Service
public class DashboardService {

    private final SellerRepository sellerRepository;
    private final OrderService orderService;
    private final ChatService chatService;

    public DashboardService(SellerRepository sellerRepository, OrderService orderService, ChatService chatService) {
        this.sellerRepository = sellerRepository;
        this.orderService = orderService;
        this.chatService = chatService;
    }

    public SellerDashboardDTO forSeller(String userId) {
        List<OrderDTO> orders = orderService.getSellerOrders(userId);
        List<ChatSummaryDTO> chats = chatService.listForSeller(userId);

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (OrderStatus st : OrderStatus.values()) {
            byStatus.put(st.name(), 0L);
        }
        double revenue = 0;
        long negotiated = 0;
        double discountSum = 0;
        for (OrderDTO o : orders) {
            byStatus.merge(o.getStatus().name(), 1L, Long::sum);
            if (o.getStatus() == OrderStatus.CANCELLED) {
                continue;
            }
            revenue += o.getTotalPrice();
            if (o.isNegotiated() && o.getListedPrice() > 0) {
                negotiated++;
                discountSum += (o.getListedPrice() - o.getUnitPrice()) / o.getListedPrice() * 100.0;
            }
        }

        SellerDashboardDTO d = new SellerDashboardDTO();
        d.setProductCount(sellerRepository.findByOwnerId(userId).size());
        d.setTotalOrders(orders.size());
        d.setPendingOrders(byStatus.getOrDefault("PENDING", 0L));
        d.setRevenue(Math.round(revenue * 100.0) / 100.0);
        d.setChatCount(chats.size());
        d.setNegotiatedOrders(negotiated);
        d.setAverageDiscountPercent(negotiated == 0 ? 0 : Math.round(discountSum / negotiated * 10.0) / 10.0);
        d.setOrdersByStatus(byStatus);
        d.setRecentOrders(orders.stream().limit(6).toList());
        d.setRecentChats(chats.stream().limit(6).toList());
        return d;
    }
}
