package com.marketreply.controller;

import com.marketreply.dto.SellerDTO;
import com.marketreply.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD endpoints for seller profiles and their negotiation rules.
 * Every request is scoped to the authenticated user via the "authUserId"
 * request attribute set by JwtAuthFilter.
 */
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping
    public ResponseEntity<SellerDTO> createSeller(@Valid @RequestBody SellerDTO dto, HttpServletRequest request) {
        String ownerId = ownerId(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.createSeller(ownerId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SellerDTO> updateSeller(@PathVariable String id, @Valid @RequestBody SellerDTO dto,
                                                   HttpServletRequest request) {
        return ResponseEntity.ok(sellerService.updateSeller(ownerId(request), id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellerDTO> getSeller(@PathVariable String id, HttpServletRequest request) {
        return ResponseEntity.ok(sellerService.getSeller(ownerId(request), id));
    }

    @GetMapping
    public ResponseEntity<List<SellerDTO>> getAllSellers(HttpServletRequest request) {
        return ResponseEntity.ok(sellerService.getAllSellers(ownerId(request)));
    }

    /**
     * Public marketplace: every seller's listing, for any logged-in user to browse
     * and pick one to message via the Buyer Analyzer. Declared before "/{id}" so
     * Spring matches this exact literal path first.
     */
    @GetMapping("/marketplace")
    public ResponseEntity<List<SellerDTO>> getMarketplaceSellers() {
        return ResponseEntity.ok(sellerService.getMarketplaceSellers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable String id, HttpServletRequest request) {
        sellerService.deleteSeller(ownerId(request), id);
        return ResponseEntity.noContent().build();
    }

    private String ownerId(HttpServletRequest request) {
        return (String) request.getAttribute("authUserId");
    }
}