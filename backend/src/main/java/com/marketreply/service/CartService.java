package com.marketreply.service;

import com.marketreply.dto.CartDTO;
import com.marketreply.dto.CartItemDTO;
import com.marketreply.dto.CheckoutRequest;
import com.marketreply.dto.CreateOrderRequest;
import com.marketreply.dto.OrderDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.model.Cart;
import com.marketreply.model.CartItem;
import com.marketreply.model.Seller;
import com.marketreply.repository.CartRepository;
import com.marketreply.repository.SellerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Manages each buyer's shopping cart: a manual path to placing an order that
 * skips the AI chat entirely. Add products, adjust quantities, then check
 * out - checkout turns the cart into one Order per seller (via
 * OrderService, so the same validation and persistence rules apply) and
 * empties the cart.
 */
@Service
public class CartService {

    private final CartRepository cartRepository;
    private final SellerRepository sellerRepository;
    private final OrderService orderService;

    public CartService(CartRepository cartRepository, SellerRepository sellerRepository, OrderService orderService) {
        this.cartRepository = cartRepository;
        this.sellerRepository = sellerRepository;
        this.orderService = orderService;
    }

    public CartDTO getCart(String buyerId) {
        return toDTO(getOrCreateCart(buyerId));
    }

    public CartDTO addItem(String buyerId, String sellerId, int quantity) {
        if (sellerId == null || sellerId.isBlank()) {
            throw new InvalidRequestException("sellerId is required");
        }
        if (quantity < 1) {
            throw new InvalidRequestException("Quantity must be at least 1");
        }
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + sellerId));

        Cart cart = getOrCreateCart(buyerId);
        CartItem existing = findItem(cart, sellerId);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            cart.getItems().add(new CartItem(seller.getId(), seller.getProductName(), seller.getListedPrice(), null, quantity));
        }
        cart.setUpdatedAt(Instant.now());
        return toDTO(cartRepository.save(cart));
    }

    public CartDTO updateQuantity(String buyerId, String sellerId, int quantity) {
        if (quantity < 1) {
            return removeItem(buyerId, sellerId);
        }
        Cart cart = getOrCreateCart(buyerId);
        CartItem item = findItem(cart, sellerId);
        if (item == null) {
            throw new ResourceNotFoundException("That product is not in your cart");
        }
        item.setQuantity(quantity);
        cart.setUpdatedAt(Instant.now());
        return toDTO(cartRepository.save(cart));
    }

    public CartDTO removeItem(String buyerId, String sellerId) {
        Cart cart = getOrCreateCart(buyerId);
        cart.getItems().removeIf(i -> i.getSellerId().equals(sellerId));
        cart.setUpdatedAt(Instant.now());
        return toDTO(cartRepository.save(cart));
    }

    public CartDTO clearCart(String buyerId) {
        Cart cart = getOrCreateCart(buyerId);
        cart.getItems().clear();
        cart.setUpdatedAt(Instant.now());
        return toDTO(cartRepository.save(cart));
    }

    /** Turns every cart line into its own Order (grouped by seller), then empties the cart. */
    public List<OrderDTO> checkout(String buyerId, CheckoutRequest request) {
        Cart cart = getOrCreateCart(buyerId);
        if (cart.getItems().isEmpty()) {
            throw new InvalidRequestException("Your cart is empty");
        }

        List<OrderDTO> created = new ArrayList<>();
        for (CartItem item : new ArrayList<>(cart.getItems())) {
            CreateOrderRequest req = new CreateOrderRequest();
            req.setSellerId(item.getSellerId());
            req.setQuantity(item.getQuantity());
            req.setDeliveryMethod("DELIVERY");
            req.setDeliveryAddress(request.getDeliveryAddress());
            if (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()) {
                req.setBuyerNotes("Preferred payment: " + request.getPaymentMethod());
            }
            created.add(orderService.createOrder(buyerId, req));
        }

        cart.getItems().clear();
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        return created;
    }

    private Cart getOrCreateCart(String buyerId) {
        return cartRepository.findByBuyerId(buyerId).orElseGet(() -> new Cart(buyerId));
    }

    private CartItem findItem(Cart cart, String sellerId) {
        return cart.getItems().stream().filter(i -> i.getSellerId().equals(sellerId)).findFirst().orElse(null);
    }

    private CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        List<CartItemDTO> items = new ArrayList<>();
        double subtotal = 0;
        int count = 0;
        for (CartItem item : cart.getItems()) {
            CartItemDTO idto = new CartItemDTO();
            idto.setSellerId(item.getSellerId());
            idto.setProductName(item.getProductName());
            idto.setListedPrice(item.getListedPrice());
            idto.setThumbnailImage(item.getThumbnailImage());
            idto.setQuantity(item.getQuantity());
            double lineTotal = (item.getListedPrice() != null ? item.getListedPrice() : 0) * item.getQuantity();
            idto.setLineTotal(lineTotal);
            items.add(idto);
            subtotal += lineTotal;
            count += item.getQuantity();
        }
        dto.setItems(items);
        dto.setSubtotal(subtotal);
        dto.setItemCount(count);
        return dto;
    }
}