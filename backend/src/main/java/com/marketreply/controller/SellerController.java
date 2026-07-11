package com.marketreply.controller;

import com.marketreply.dto.SellerDTO;
import com.marketreply.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** CRUD endpoints for seller profiles and their negotiation rules. */
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping
    public ResponseEntity<SellerDTO> createSeller(@Valid @RequestBody SellerDTO dto, HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.createSeller(dto, ownerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SellerDTO> updateSeller(@PathVariable String id, @Valid @RequestBody SellerDTO dto,
                                                    HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");
        return ResponseEntity.ok(sellerService.updateSeller(id, dto, ownerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellerDTO> getSeller(@PathVariable String id) {
        return ResponseEntity.ok(sellerService.getSeller(id));
    }

    /** Seller Settings: only the logged-in user's own profiles. */
    @GetMapping
    public ResponseEntity<List<SellerDTO>> getMySellers(HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");
        return ResponseEntity.ok(sellerService.getMySellers(ownerId));
    }

    /** All Sellers directory: every seller profile, unscoped. */
    @GetMapping("/directory")
    public ResponseEntity<List<SellerDTO>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable String id, HttpServletRequest request) {
        String ownerId = (String) request.getAttribute("authUserId");
        sellerService.deleteSeller(id, ownerId);
        return ResponseEntity.noContent().build();
    }
}