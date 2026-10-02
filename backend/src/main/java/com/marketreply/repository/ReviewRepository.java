package com.marketreply.repository;

import com.marketreply.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    Optional<Review> findByOrderId(String orderId);
    boolean existsByOrderId(String orderId);
}