package com.marketreply.service;

import com.marketreply.dto.CreateReviewRequest;
import com.marketreply.dto.ReviewDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.model.Order;
import com.marketreply.model.OrderStatus;
import com.marketreply.model.Review;
import com.marketreply.model.User;
import com.marketreply.repository.OrderRepository;
import com.marketreply.repository.ReviewRepository;
import com.marketreply.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Lets a buyer leave a 1-5 star rating + comment on an order once it's
 * DELIVERED — exactly one review per order. Also computes the aggregate
 * rating shown on a seller's listings.
 */
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, OrderRepository orderRepository,
                          UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public ReviewDTO createReview(String buyerId, CreateReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.getOrderId()));

        if (!buyerId.equals(order.getBuyerId())) {
            throw new InvalidRequestException("Only the buyer on this order can leave a review");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new InvalidRequestException("You can only review an order after it's been delivered");
        }
        if (reviewRepository.existsByOrderId(order.getId())) {
            throw new InvalidRequestException("This order has already been reviewed");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + buyerId));

        Review review = new Review();
        review.setSellerId(order.getSellerId());
        review.setOrderId(order.getId());
        review.setBuyerId(buyerId);
        review.setBuyerName(buyer.getName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(Instant.now());

        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    /** All reviews for a given seller listing, most recent first. */
    public List<ReviewDTO> getReviewsForSeller(String sellerId) {
        return reviewRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(this::toDTO)
                .toList();
    }

    /** Whether the given order already has a review (used to hide the "leave a review" button). */
    public boolean hasReview(String orderId) {
        return reviewRepository.existsByOrderId(orderId);
    }

    /** Average rating (rounded to 1 decimal) and count for every seller, keyed by sellerId. */
    public Map<String, double[]> averageRatingsBySeller(List<String> sellerIds) {
        Map<String, List<Review>> bySeller = reviewRepository.findAll().stream()
                .filter(r -> sellerIds.contains(r.getSellerId()))
                .collect(Collectors.groupingBy(Review::getSellerId));

        return sellerIds.stream().collect(Collectors.toMap(
                id -> id,
                id -> {
                    List<Review> reviews = bySeller.getOrDefault(id, List.of());
                    if (reviews.isEmpty()) {
                        return new double[]{0, 0};
                    }
                    double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
                    return new double[]{Math.round(avg * 10) / 10.0, reviews.size()};
                }
        ));
    }

    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setSellerId(review.getSellerId());
        dto.setOrderId(review.getOrderId());
        dto.setBuyerName(review.getBuyerName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}