package com.marketreply.repository;

import com.marketreply.model.Conversation;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findBySellerId(String sellerId, Sort sort);

    List<Conversation> findAllByOrderByCreatedAtDesc();

    long countBySellerId(String sellerId);
}
