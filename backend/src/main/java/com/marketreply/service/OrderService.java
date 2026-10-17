package com.marketreply.service;

import com.marketreply.dto.CreateOrderRequest;
import com.marketreply.dto.OrderDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Order;
import com.marketreply.model.OrderStatus;
import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;
import com.marketreply.negotiation.CommerceRules;
import com.marketreply.negotiation.NegotiationEngine;
import com.marketreply.model.User;
import com.marketreply.repository.OrderRepository;
import com.marketreply.repository.SellerRepository;
import com.marketreply.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Places and manages full purchase records. A buyer creates an order against
 * any seller's listing; the seller (listing owner) progresses it through
 * PENDING -> CONFIRMED -> SHIPPED -> DELIVERED, or the buyer cancels it while
 * it's still PENDING.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, SellerRepository sellerRepository,
                         UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }

    /** Regular purchase at the listed price (product page "Buy now" and cart checkout). */
    public OrderDTO createOrder(String buyerId, CreateOrderRequest request) {
        Seller seller = sellerRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + request.getSellerId()));
        double listed = seller.getListedPrice() != null ? seller.getListedPrice() : 0;
        return placeOrder(buyerId, seller, request.getQuantity(), listed,
                request.getDeliveryMethod(), request.getDeliveryAddress(), request.getPaymentMethod(),
                request.getBuyerPhone(), request.getConversationId(), request.getBuyerNotes());
    }

    /**
     * The single place an order is created. unitPrice is decided by the server (list price, or the
     * price the assistant agreed in the chat session) - it is never taken from the browser. Every
     * rule the seller set (stock, minimum price, delivery area, payment methods) is re-checked here.
     */
    public OrderDTO placeOrder(String buyerId, Seller seller, int quantity, double unitPrice,
                               String deliveryMethod, String deliveryAddress, String paymentMethod,
                               String buyerPhone, String conversationId, String buyerNotes) {
        SellerRule rules = seller.getRules();

        if (quantity < 1) {
            throw new InvalidRequestException("Quantity must be at least 1");
        }
        if (!CommerceRules.inStock(seller, quantity)) {
            throw new InvalidRequestException("Only " + seller.getStock() + " in stock");
        }
        if (unitPrice + 0.005 < NegotiationEngine.floor(seller)) {
            throw new InvalidRequestException("That price is below what the seller can accept");
        }

        boolean canDeliver = rules == null || Boolean.TRUE.equals(rules.getDeliveryAvailable());
        boolean canPickup = rules != null && Boolean.TRUE.equals(rules.getPickupAvailable());
        String method = deliveryMethod == null || deliveryMethod.isBlank()
                ? (canDeliver ? "DELIVERY" : "PICKUP") : deliveryMethod.toUpperCase();
        if ("DELIVERY".equals(method)) {
            if (!canDeliver) {
                throw new InvalidRequestException("This seller does not offer delivery");
            }
            if (deliveryAddress == null || deliveryAddress.isBlank()) {
                throw new InvalidRequestException("A delivery address is required");
            }
            if (!CommerceRules.servesLocation(rules, deliveryAddress)) {
                throw new InvalidRequestException("The seller does not deliver to that location. They deliver to: "
                        + String.join(", ", rules.getDeliveryLocations()));
            }
        } else if ("PICKUP".equals(method)) {
            if (!canPickup) {
                throw new InvalidRequestException("This seller does not offer pickup");
            }
        } else {
            throw new InvalidRequestException("Delivery method must be DELIVERY or PICKUP");
        }

        String payment = CommerceRules.matchAcceptedPayment(rules, paymentMethod);
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new InvalidRequestException("Please choose a payment method");
        }
        if (payment == null) {
            throw new InvalidRequestException("The seller does not accept " + paymentMethod
                    + ". Accepted: " + String.join(", ", rules.getAcceptedPaymentMethods()));
        }

        String phone = buyerPhone == null ? "" : buyerPhone.replaceAll("[^0-9+]", "");
        if (phone.replace("+", "").length() < 10) {
            throw new InvalidRequestException("A valid contact phone number is required");
        }

        double subtotal = round2(unitPrice * quantity);
        double fee = CommerceRules.deliveryFee(rules, method, subtotal);

        Order order = new Order();
        order.setSellerId(seller.getId());
        order.setBuyerId(buyerId);
        order.setConversationId(conversationId);
        order.setProductName(seller.getProductName());
        order.setQuantity(quantity);
        order.setListedPrice(seller.getListedPrice() != null ? seller.getListedPrice() : 0);
        order.setUnitPrice(unitPrice);
        order.setDeliveryCharge(fee);
        order.setTotalPrice(round2(subtotal + fee));
        order.setDeliveryMethod(method);
        order.setDeliveryAddress("PICKUP".equals(method) ? rules.getPickupAddress() : deliveryAddress.trim());
        order.setPaymentMethod(payment);
        order.setBuyerPhone(phone);
        order.setBuyerNotes(buyerNotes);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        if (seller.getStock() != null) {
            seller.setStock(seller.getStock() - quantity);
            sellerRepository.save(seller);
        }
        return toDTO(orderRepository.save(order));
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private void restock(Order order) {
        sellerRepository.findById(order.getSellerId()).ifPresent(seller -> {
            if (seller.getStock() != null) {
                seller.setStock(seller.getStock() + order.getQuantity());
                sellerRepository.save(seller);
            }
        });
    }

    /** Every order the user can see: ones they placed as a buyer, or ones placed against listings they own. */
    public List<OrderDTO> getMyOrders(String userId) {
        java.util.Set<String> ownedSellerIds = new java.util.HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(userId)) {
            ownedSellerIds.add(s.getId());
        }

        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(o -> userId.equals(o.getBuyerId()) || ownedSellerIds.contains(o.getSellerId()))
                .map(this::toDTO)
                .toList();
    }

    /** Used by the chat view to show the order a chat produced. */
    public OrderDTO getOrderForViewer(String userId, String orderId) {
        return getOrder(userId, orderId);
    }

    /** Orders placed against products this user sells (seller view only). */
    public List<OrderDTO> getSellerOrders(String userId) {
        java.util.Set<String> owned = new java.util.HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(userId)) {
            owned.add(s.getId());
        }
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(o -> owned.contains(o.getSellerId()))
                .map(this::toDTO)
                .toList();
    }

    public OrderDTO getOrder(String userId, String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        assertVisible(userId, order);
        return toDTO(order);
    }

    /** Only the seller who owns the listing can advance an order's status. */
    public OrderDTO updateStatus(String userId, String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        Seller seller = sellerRepository.findById(order.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + order.getSellerId()));
        if (!userId.equals(seller.getOwnerId())) {
            throw new InvalidRequestException("Only the seller can update this order's status");
        }
        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidRequestException("This order is already " + order.getStatus() + " and cannot be changed");
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.CANCELLED) {
            restock(order);
        }
        order.setUpdatedAt(Instant.now());
        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    /** The buyer can cancel their own order only while it's still PENDING. */
    public OrderDTO cancelOrder(String userId, String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!userId.equals(order.getBuyerId())) {
            throw new InvalidRequestException("Only the buyer can cancel this order");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidRequestException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        restock(order);
        order.setUpdatedAt(Instant.now());
        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    private void assertVisible(String userId, Order order) {
        boolean isBuyer = userId.equals(order.getBuyerId());
        boolean isSellerOwner = sellerRepository.findById(order.getSellerId())
                .map(Seller::getOwnerId)
                .map(userId::equals)
                .orElse(false);
        if (!isBuyer && !isSellerOwner) {
            throw new ResourceNotFoundException("Order not found: " + order.getId());
        }
    }

    private OrderDTO toDTO(Order order) {
        String sellerName = sellerRepository.findById(order.getSellerId())
                .map(Seller::getName).orElse("Unknown");
        String buyerName = userRepository.findById(order.getBuyerId())
                .map(User::getName).orElse("Unknown");
        return DTOMapper.toDTO(order, sellerName, buyerName);
    }
}