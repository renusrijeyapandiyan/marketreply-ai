package com.marketreply.dto;

import com.marketreply.model.SellerRule;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

/**
 * Request/response payload for creating or updating a seller profile and rules.
 */
public class SellerDTO {

    /** Max product photos a seller can upload for one listing. */
    public static final int MAX_PRODUCT_IMAGES = 10;

    private String id;

    @NotBlank(message = "Seller name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productDescription;

    @NotNull(message = "Listed price is required")
    @Positive(message = "Listed price must be positive")
    private Double listedPrice;

    @NotNull(message = "Rules are required")
    private SellerRule rules;

    /** Read-only aggregate populated by SellerService - not set from the request. */
    private Double averageRating;
    private long reviewCount;
    private List<String> productImages;
    private String thumbnailImage;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Double getListedPrice() {
        return listedPrice;
    }

    public void setListedPrice(Double listedPrice) {
        this.listedPrice = listedPrice;
    }

    public SellerRule getRules() {
        return rules;
    }

    public void setRules(SellerRule rules) {
        this.rules = rules;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<String> productImages) {
        this.productImages = productImages;
    }

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }
}