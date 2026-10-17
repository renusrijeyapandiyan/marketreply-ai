package com.marketreply.repository;

import com.marketreply.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {

    /** The buyer's most recent session for this product (used to resume a chat). */
    Optional<ChatSession> findFirstByBuyerIdAndSellerIdOrderByUpdatedAtDesc(String buyerId, String sellerId);

    List<ChatSession> findByBuyerIdOrderByUpdatedAtDesc(String buyerId);

    List<ChatSession> findBySellerIdInOrderByUpdatedAtDesc(java.util.Collection<String> sellerIds);
}
