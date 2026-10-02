package com.marketreply.controller;

import com.marketreply.dto.CartDTO;
import com.marketreply.dto.CheckoutRequest;
import com.marketreply.dto.OrderDTO;
import com.marketreply.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * A buyer's shopping cart: add products, adjust quantities, and check out -
 * a manual path to placing an order that doesn't require the AI chat first.
 * Every request is scoped to the authenticated user via the "authUserId"
 * request attribute set by JwtAuthFilter.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(HttpServletRequest request) {
        return ResponseEntity.ok(cartService.getCart(buyerId(request)));
    }

    /** Body for adding an item: {"sellerId": "...", "quantity": 1} */
    public static class AddItemRequest {
        private String sellerId;
        private Integer quantity = 1;

        public String getSellerId() {
            return sellerId;
        }

        public void setSellerId(String sellerId) {
            this.sellerId = sellerId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    /** Body for updating a line's quantity: {"quantity": 2} */
    public static class UpdateQuantityRequest {
        private Integer quantity;

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(@RequestBody AddItemRequest body, HttpServletRequest request) {
        int qty = body.getQuantity() != null ? body.getQuantity() : 1;
        return ResponseEntity.ok(cartService.addItem(buyerId(request), body.getSellerId(), qty));
    }

    @PatchMapping("/items/{sellerId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable String sellerId,
                                                    @RequestBody UpdateQuantityRequest body,
                                                    HttpServletRequest request) {
        int qty = body.getQuantity() != null ? body.getQuantity() : 1;
        return ResponseEntity.ok(cartService.updateQuantity(buyerId(request), sellerId, qty));
    }

    @DeleteMapping("/items/{sellerId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable String sellerId, HttpServletRequest request) {
        return ResponseEntity.ok(cartService.removeItem(buyerId(request), sellerId));
    }

    @DeleteMapping
    public ResponseEntity<CartDTO> clearCart(HttpServletRequest request) {
        return ResponseEntity.ok(cartService.clearCart(buyerId(request)));
    }

    @PostMapping("/checkout")
    public ResponseEntity<List<OrderDTO>> checkout(@Valid @RequestBody CheckoutRequest checkoutRequest,
                                                     HttpServletRequest request) {
        List<OrderDTO> orders = cartService.checkout(buyerId(request), checkoutRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(orders);
    }

    private String buyerId(HttpServletRequest request) {
        return (String) request.getAttribute("authUserId");
    }
}