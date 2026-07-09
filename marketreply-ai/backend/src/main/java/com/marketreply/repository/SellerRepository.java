package com.marketreply.repository;

import com.marketreply.model.Seller;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepository extends MongoRepository<Seller, String> {
    boolean existsByEmail(String email);
    java.util.List<Seller> findByOwnerId(String ownerId);
}
