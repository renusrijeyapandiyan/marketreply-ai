package com.marketreply.controller;

import com.marketreply.dto.CreateOrderRequest;
import com.marketreply.dto.OrderDTO;
import com.marketreply.dto.UpdateOrderStatusRequest;
import com.marketreply.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Order endpoints. Every request is scoped to the authenticated user via the
 * "authUserId" request attribute set by JwtAuthFilter.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** A buyer places an order against any seller's listing. */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                 HttpServletRequest httpRequest) {
        OrderDTO created = orderService.createOrder(userId(httpRequest), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Every order visible to the current user: placed by them, or placed against their listings. */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(HttpServletRequest request) {
        return ResponseEntity.ok(orderService.getMyOrders(userId(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable String id, HttpServletRequest request) {
        return ResponseEntity.ok(orderService.getOrder(userId(request), id));
    }

    /** Seller-only: advance the order to a new status. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable String id,
                                                  @Valid @RequestBody UpdateOrderStatusRequest request,
                                                  HttpServletRequest httpRequest) {
        OrderDTO updated = orderService.updateStatus(userId(httpRequest), id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    /** Buyer-only: cancel their own order while it's still PENDING. */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable String id, HttpServletRequest request) {
        return ResponseEntity.ok(orderService.cancelOrder(userId(request), id));
    }

    private String userId(HttpServletRequest request) {
        return (String) request.getAttribute("authUserId");
    }
}