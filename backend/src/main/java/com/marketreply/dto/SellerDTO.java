package com.marketreply.dto;

import com.marketreply.model.SellerRule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

/**
 * Seller-facing (private) view of a product listing. Contains the minimum acceptable price and the
 * discount settings, so it must only ever be returned to the owner of the listing. Buyers get
 * {@link ProductPublicDTO} instead.
 */
public class SellerDTO {

    public static final int MAX_PRODUCT_IMAGES = 5;

    private String id;
    private String name;
    private String email;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productDescription;
    private String category;

    @NotNull(message = "Selling price is required")
    @Positive(message = "Selling price must be positive")
    private Double listedPrice;

    private Integer stock;

    @NotNull(message = "Rules are required")
    private SellerRule rules;

    private List<String> productImages;

    /** Read-only aggregate populated by SellerService - not set from the request. */
    private Double averageRating;
    private long reviewCount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getListedPrice() { return listedPrice; }
    public void setListedPrice(Double listedPrice) { this.listedPrice = listedPrice; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public SellerRule getRules() { return rules; }
    public void setRules(SellerRule rules) { this.rules = rules; }

    public List<String> getProductImages() { return productImages; }
    public void setProductImages(List<String> productImages) { this.productImages = productImages; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public long getReviewCount() { return reviewCount; }
    public void setReviewCount(long reviewCount) { this.reviewCount = reviewCount; }
}
