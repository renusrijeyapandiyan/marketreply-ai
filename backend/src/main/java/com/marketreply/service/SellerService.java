package com.marketreply.service;

import com.marketreply.dto.ProductPublicDTO;
import com.marketreply.dto.SellerDTO;
import com.marketreply.model.SellerRule;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Seller;
import com.marketreply.model.User;
import com.marketreply.repository.SellerRepository;
import com.marketreply.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
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
        seller.setProductImages(new ArrayList<>());
        normalize(seller);
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
        existing.setCategory(dto.getCategory());
        existing.setStock(dto.getStock());
        existing.setRules(dto.getRules());
        normalize(existing);
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

    /** Public marketplace: buyer-safe cards for every product (cover photo only, no private pricing). */
    public List<ProductPublicDTO> getMarketplaceProducts() {
        List<ProductPublicDTO> list = sellerRepository.findAll().stream()
                .map(s -> DTOMapper.toPublicDTO(s, false)).toList();
        Map<String, double[]> ratings = reviewService.averageRatingsBySeller(list.stream().map(ProductPublicDTO::getId).toList());
        for (ProductPublicDTO dto : list) {
            double[] agg = ratings.getOrDefault(dto.getId(), new double[]{0, 0});
            dto.setAverageRating(agg[0] > 0 ? agg[0] : null);
            dto.setReviewCount((long) agg[1]);
        }
        return list;
    }

    /** Public product page: buyer-safe, with all photos. */
    public ProductPublicDTO getPublicProduct(String id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        ProductPublicDTO dto = DTOMapper.toPublicDTO(seller, true);
        double[] agg = reviewService.averageRatingsBySeller(List.of(id)).getOrDefault(id, new double[]{0, 0});
        dto.setAverageRating(agg[0] > 0 ? agg[0] : null);
        dto.setReviewCount((long) agg[1]);
        return dto;
    }

    /**
     * Keeps the seller's pricing rules internally consistent:
     *   minimum acceptable price = selling price minus the maximum discount.
     * The seller only enters the discount %, so the floor can never drift out of sync with the price.
     */
    public static void normalize(Seller seller) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        double listed = seller.getListedPrice() != null ? seller.getListedPrice() : 0;

        double pct = r.getMaxDiscountPercent() != null ? r.getMaxDiscountPercent() : 0;
        pct = Math.max(0, Math.min(90, pct));
        r.setMaxDiscountPercent(pct);
        r.setMinPrice(Math.round(listed * (1 - pct / 100.0) * 100.0) / 100.0);

        if (r.getNegotiationStyle() == null || r.getNegotiationStyle().isBlank()) {
            r.setNegotiationStyle("MODERATE");
        }
        if (r.getDeliveryCharge() != null && r.getDeliveryCharge() < 0) {
            r.setDeliveryCharge(0.0);
        }
        r.setDeliveryLocations(cleanList(r.getDeliveryLocations()));
        r.setAcceptedPaymentMethods(cleanList(r.getAcceptedPaymentMethods()));
        if (seller.getStock() != null && seller.getStock() < 0) {
            seller.setStock(0);
        }
        seller.setRules(r);
    }

    private static List<String> cleanList(List<String> in) {
        List<String> out = new ArrayList<>();
        if (in != null) {
            for (String v : in) {
                if (v != null && !v.isBlank() && out.stream().noneMatch(x -> x.equalsIgnoreCase(v.trim()))) {
                    out.add(v.trim());
                }
            }
        }
        return out;
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