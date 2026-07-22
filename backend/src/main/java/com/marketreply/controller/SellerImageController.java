package com.marketreply.controller;

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
import java.util.Base64;
import java.util.Map;
import java.util.Set;

/** Handles uploading/removing a product photo for a seller listing. */
@RestController
@RequestMapping("/api/sellers")
public class SellerImageController {

    private static final long MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final SellerRepository sellerRepository;

    public SellerImageController(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    @PostMapping(value = "/{id}/image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(@PathVariable String id,
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

        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUri = "data:" + file.getContentType() + ";base64," + base64;

        seller.setProductImageUrl(dataUri);
        seller.setUpdatedAt(Instant.now());
        sellerRepository.save(seller);

        return ResponseEntity.ok(Map.of("productImageUrl", dataUri));
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> removeImage(@PathVariable String id, HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + id));

        if (!seller.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("You do not have access to this seller profile");
        }

        seller.setProductImageUrl(null);
        seller.setUpdatedAt(Instant.now());
        sellerRepository.save(seller);

        return ResponseEntity.noContent().build();
    }
}