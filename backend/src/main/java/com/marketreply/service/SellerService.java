package com.marketreply.service;

import com.marketreply.dto.SellerDTO;
import com.marketreply.dto.SellerSummaryDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.mapper.DTOMapper;
import com.marketreply.model.Seller;
import com.marketreply.repository.SellerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    public SellerDTO createSeller(String ownerId, SellerDTO dto) {
        validateImageCount(dto);

        Seller seller = DTOMapper.toEntity(dto);
        seller.setId(null);
        seller.setOwnerId(ownerId);
        seller.setCreatedAt(Instant.now());
        seller.setUpdatedAt(Instant.now());
        Seller saved = sellerRepository.save(seller);
        return DTOMapper.toDTO(saved);
    }

    public SellerDTO updateSeller(String ownerId, String id, SellerDTO dto) {
        validateImageCount(dto);

        Seller existing = getOwnedSellerOrThrow(ownerId, id);

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setProductName(dto.getProductName());
        existing.setProductDescription(dto.getProductDescription());
        existing.setListedPrice(dto.getListedPrice());
        existing.setProductSize(dto.getProductSize());
        existing.setProductImages(dto.getProductImages());
        existing.setRules(dto.getRules());
        existing.setUpdatedAt(Instant.now());

        Seller saved = sellerRepository.save(existing);
        return DTOMapper.toDTO(saved);
    }

    public SellerDTO getSeller(String ownerId, String id) {
        return DTOMapper.toDTO(getOwnedSellerOrThrow(ownerId, id));
    }

    public Seller getSellerEntity(String ownerId, String id) {
        return getOwnedSellerOrThrow(ownerId, id);
    }

    public List<SellerDTO> getAllSellers(String ownerId) {
        return sellerRepository.findByOwnerId(ownerId).stream().map(DTOMapper::toDTO).toList();
    }

    /** Public marketplace listing: every seller, one thumbnail each — fast to load regardless of how many photos sellers upload. */
    public List<SellerSummaryDTO> getMarketplaceSellers() {
        return sellerRepository.findAll().stream().map(DTOMapper::toSummaryDTO).toList();
    }

    public void deleteSeller(String ownerId, String id) {
        Seller existing = getOwnedSellerOrThrow(ownerId, id);
        sellerRepository.delete(existing);
    }

    private void validateImageCount(SellerDTO dto) {
        if (dto.getProductImages() != null && dto.getProductImages().size() > SellerDTO.MAX_PRODUCT_IMAGES) {
            throw new InvalidRequestException(
                    "You can upload at most " + SellerDTO.MAX_PRODUCT_IMAGES + " product photos");
        }
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