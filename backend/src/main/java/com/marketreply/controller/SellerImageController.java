package com.marketreply.controller;

import com.marketreply.dto.SellerDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.model.Seller;
import com.marketreply.repository.SellerRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Handles uploading/removing product photos for a seller listing (up to 10 images). */
@RestController
@RequestMapping("/api/sellers")
public class SellerImageController {

    private static final long MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final SellerRepository sellerRepository;

    public SellerImageController(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    /** Appends a new photo to the seller's productImages list. */
    @PostMapping(value = "/{id}/images", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> uploadImage(@PathVariable String id,
                                                             @RequestParam("file") MultipartFile file,
                                                             HttpServletRequest request) throws IOException {
        String ownerId = (String) request.getAttribute("authUserId");

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));

        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }
        if (file.isEmpty()) {
            throw new InvalidRequestException("No image file was uploaded");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new InvalidRequestException("Image must be smaller than 2MB");
        }
        if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidRequestException("Only JPEG, PNG, or WEBP images are allowed");
        }

        List<String> images = seller.getProductImages() != null
                ? new ArrayList<>(seller.getProductImages())
                : new ArrayList<>();

        if (images.size() >= SellerDTO.MAX_PRODUCT_IMAGES) {
            throw new InvalidRequestException("You can only upload up to " + SellerDTO.MAX_PRODUCT_IMAGES + " photos");
        }

        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUri = "data:" + file.getContentType() + ";base64," + base64;
        images.add(dataUri);

        seller.setProductImages(images);
        seller.setUpdatedAt(Instant.now());
        sellerRepository.save(seller);

        return ResponseEntity.ok(Map.of("productImages", images));
    }

    /** Removes one photo by its position in the list (0-based). */
    @DeleteMapping("/{id}/images/{index}")
    public ResponseEntity<Map<String, Object>> removeImage(@PathVariable String id,
                                                             @PathVariable int index,
                                                             HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));

        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }

        List<String> images = seller.getProductImages() != null
                ? new ArrayList<>(seller.getProductImages())
                : new ArrayList<>();

        if (index < 0 || index >= images.size()) {
            throw new InvalidRequestException("No image at position " + index);
        }

        images.remove(index);
        seller.setProductImages(images);
        seller.setUpdatedAt(Instant.now());
        sellerRepository.save(seller);

        return ResponseEntity.ok(Map.of("productImages", images));
    }
}