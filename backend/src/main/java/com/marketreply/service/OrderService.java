package com.marketreply.service;

import com.marketreply.dto.CreateOrderRequest;
import com.marketreply.dto.OrderDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Order;
import com.marketreply.model.OrderStatus;
import com.marketreply.model.Seller;
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

    public OrderDTO createOrder(String buyerId, CreateOrderRequest request) {
        Seller seller = sellerRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + request.getSellerId()));

        if (request.getQuantity() < 1) {
            throw new InvalidRequestException("Quantity must be at least 1");
        }

        Order order = new Order();
        order.setSellerId(seller.getId());
        order.setBuyerId(buyerId);
        order.setConversationId(request.getConversationId());
        order.setProductName(seller.getProductName());
        order.setQuantity(request.getQuantity());
        order.setUnitPrice(seller.getListedPrice() != null ? seller.getListedPrice() : 0);
        order.setTotalPrice(order.getUnitPrice() * request.getQuantity());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setBuyerNotes(request.getBuyerNotes());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        Order saved = orderRepository.save(order);
        return toDTO(saved);
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