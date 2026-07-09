package com.marketreply.service;

import com.marketreply.dto.SellerDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Seller;
import com.marketreply.repository.SellerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * CRUD operations for seller profiles and their negotiation rules.
 * Every profile belongs to exactly one authenticated user (ownerId); all
 * reads/writes are scoped so users only ever see their own profiles.
 */
@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    public SellerDTO createSeller(String ownerId, SellerDTO dto) {
        Seller seller = DTOMapper.toEntity(dto);
        seller.setId(null);
        seller.setOwnerId(ownerId);
        seller.setCreatedAt(Instant.now());
        seller.setUpdatedAt(Instant.now());
        Seller saved = sellerRepository.save(seller);
        return DTOMapper.toDTO(saved);
    }

    public SellerDTO updateSeller(String ownerId, String id, SellerDTO dto) {
        Seller existing = getOwnedSellerOrThrow(ownerId, id);

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setProductName(dto.getProductName());
        existing.setProductDescription(dto.getProductDescription());
        existing.setListedPrice(dto.getListedPrice());
        existing.setRules(dto.getRules());
        existing.setUpdatedAt(Instant.now());

        Seller saved = sellerRepository.save(existing);
        return DTOMapper.toDTO(saved);
    }

    public SellerDTO getSeller(String ownerId, String id) {
        return DTOMapper.toDTO(getOwnedSellerOrThrow(ownerId, id));
    }

    /** Used internally by AI/conversation flows, which only need the entity. */
    public Seller getSellerEntity(String ownerId, String id) {
        return getOwnedSellerOrThrow(ownerId, id);
    }

    public List<SellerDTO> getAllSellers(String ownerId) {
        return sellerRepository.findByOwnerId(ownerId).stream().map(DTOMapper::toDTO).toList();
    }

    /** Public marketplace listing: every seller profile, regardless of owner, for buyers to browse. */
    public List<SellerDTO> getMarketplaceSellers() {
        return sellerRepository.findAll().stream().map(DTOMapper::toDTO).toList();
    }

    public void deleteSeller(String ownerId, String id) {
        Seller existing = getOwnedSellerOrThrow(ownerId, id);
        sellerRepository.delete(existing);
    }

    private Seller getOwnedSellerOrThrow(String ownerId, String id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));
        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }
        return seller;
    }
}