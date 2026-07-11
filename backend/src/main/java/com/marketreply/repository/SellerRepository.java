package com.marketreply.repository;

import com.marketreply.model.Seller;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellerRepository extends MongoRepository<Seller, String> {
    boolean existsByEmail(String email);
    List<Seller> findByOwnerId(String ownerId);
}