package com.marketreply.service;

import com.marketreply.dto.SellerDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Seller;
import com.marketreply.model.User;
import com.marketreply.repository.SellerRepository;
import com.marketreply.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * CRUD operations for product listings and their negotiation rules.
 *
 * A "seller identity" (name/email) belongs to the user's account, not to any
 * one listing — it's always derived from the authenticated user, never taken
 * from the request body. This lets one account list many products (each with
 * its own price, size, photos, and rules) without re-entering seller details
 * every time, and keeps that identity consistent if the user updates their
 * account name later.
 *
 * Every listing belongs to exactly one authenticated user (ownerId); all
 * reads/writes are scoped so users only ever manage their own listings.
 */
@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository,
                          ReviewService reviewService) {
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
    }

    public SellerDTO createSeller(String ownerId, SellerDTO dto) {
        User owner = getOwnerOrThrow(ownerId);

        Seller seller = DTOMapper.toEntity(dto);
        seller.setId(null);
        seller.setOwnerId(ownerId);
        seller.setName(owner.getName());
        seller.setEmail(owner.getEmail());
        seller.setCreatedAt(Instant.now());
        seller.setUpdatedAt(Instant.now());
        Seller saved = sellerRepository.save(seller);
        return withRating(DTOMapper.toDTO(saved));
    }

    public SellerDTO updateSeller(String ownerId, String id, SellerDTO dto) {
        User owner = getOwnerOrThrow(ownerId);
        Seller existing = getOwnedSellerOrThrow(ownerId, id);

        // Identity always reflects the current account, not whatever the client sent.
        existing.setName(owner.getName());
        existing.setEmail(owner.getEmail());
        existing.setProductName(dto.getProductName());
        existing.setProductDescription(dto.getProductDescription());
        existing.setListedPrice(dto.getListedPrice());
        existing.setRules(dto.getRules());
        existing.setUpdatedAt(Instant.now());

        Seller saved = sellerRepository.save(existing);
        return withRating(DTOMapper.toDTO(saved));
    }

    public SellerDTO getSeller(String ownerId, String id) {
        return withRating(DTOMapper.toDTO(getOwnedSellerOrThrow(ownerId, id)));
    }

    /** Used internally by AI/conversation flows, which only need the entity. */
    public Seller getSellerEntity(String ownerId, String id) {
        return getOwnedSellerOrThrow(ownerId, id);
    }

    /** Every product listing belonging to this account. */
    public List<SellerDTO> getAllSellers(String ownerId) {
        return withRatings(sellerRepository.findByOwnerId(ownerId).stream().map(DTOMapper::toDTO).toList());
    }

    /** Public marketplace listing: every product from every seller, for buyers to browse. */
    public List<SellerDTO> getMarketplaceSellers() {
        return withRatings(sellerRepository.findAll().stream().map(DTOMapper::toDTO).toList());
    }

    public void deleteSeller(String ownerId, String id) {
        Seller existing = getOwnedSellerOrThrow(ownerId, id);
        sellerRepository.delete(existing);
    }

    private User getOwnerOrThrow(String ownerId) {
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + ownerId));
    }

    private Seller getOwnedSellerOrThrow(String ownerId, String id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));
        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }
        return seller;
    }

    private SellerDTO withRating(SellerDTO dto) {
        Map<String, double[]> ratings = reviewService.averageRatingsBySeller(List.of(dto.getId()));
        double[] agg = ratings.getOrDefault(dto.getId(), new double[]{0, 0});
        dto.setAverageRating(agg[0] > 0 ? agg[0] : null);
        dto.setReviewCount((long) agg[1]);
        return dto;
    }

    private List<SellerDTO> withRatings(List<SellerDTO> dtos) {
        List<String> ids = dtos.stream().map(SellerDTO::getId).toList();
        Map<String, double[]> ratings = reviewService.averageRatingsBySeller(ids);
        for (SellerDTO dto : dtos) {
            double[] agg = ratings.getOrDefault(dto.getId(), new double[]{0, 0});
            dto.setAverageRating(agg[0] > 0 ? agg[0] : null);
            dto.setReviewCount((long) agg[1]);
        }
        return dtos;
    }
}