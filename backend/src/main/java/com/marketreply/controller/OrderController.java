package com.marketreply.controller;

import com.marketreply.dto.OrderDTO;
import com.marketreply.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(HttpServletRequest request) {
        String userId = (String) request.getAttribute("authUserId");
        return ResponseEntity.ok(orderService.getOrdersForUser(userId));
    }
}