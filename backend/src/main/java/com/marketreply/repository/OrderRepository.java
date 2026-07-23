package com.marketreply.repository;

import com.marketreply.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findBySellerIdInOrderByCreatedAtDesc(Collection<String> sellerIds);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
}