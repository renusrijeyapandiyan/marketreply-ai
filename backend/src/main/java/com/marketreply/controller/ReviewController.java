package com.marketreply.controller;

import com.marketreply.dto.CreateReviewRequest;
import com.marketreply.dto.ReviewDTO;
import com.marketreply.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody CreateReviewRequest request,
                                                   HttpServletRequest httpRequest) {
        String buyerId = (String) httpRequest.getAttribute("authUserId");
        ReviewDTO created = reviewService.createReview(buyerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForSeller(@PathVariable String sellerId) {
        return ResponseEntity.ok(reviewService.getReviewsForSeller(sellerId));
    }
}