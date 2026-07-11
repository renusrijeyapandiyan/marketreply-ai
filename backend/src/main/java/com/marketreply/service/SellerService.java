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

/** CRUD operations for seller profiles and their negotiation rules. */
@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    public SellerDTO createSeller(SellerDTO dto, String ownerId) {
        Seller seller = DTOMapper.toEntity(dto);
        seller.setId(null);
        seller.setOwnerId(ownerId);
        seller.setCreatedAt(Instant.now());
        seller.setUpdatedAt(Instant.now());
        Seller saved = sellerRepository.save(seller);
        return DTOMapper.toDTO(saved);
    }

    public SellerDTO updateSeller(String id, SellerDTO dto, String ownerId) {
        Seller existing = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));

        if (!existing.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }

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

    public SellerDTO getSeller(String id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));
        return DTOMapper.toDTO(seller);
    }

    public Seller getSellerEntity(String id) {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));
    }

    /** Only the logged-in user's own seller profiles — used by Seller Settings. */
    public List<SellerDTO> getMySellers(String ownerId) {
        return sellerRepository.findByOwnerId(ownerId).stream().map(DTOMapper::toDTO).toList();
    }

    /** Every seller profile in the system, regardless of owner — used by the All Sellers directory. */
    public List<SellerDTO> getAllSellers() {
        return sellerRepository.findAll().stream().map(DTOMapper::toDTO).toList();
    }

    public void deleteSeller(String id, String ownerId) {
        Seller existing = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));

        if (!existing.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }

        sellerRepository.deleteById(id);
    }
}