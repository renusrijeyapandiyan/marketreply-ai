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

    /** Sentinel value for productSize meaning "no fixed size, made/sized to order". */
    public static final String CUSTOM_SIZE = "CUSTOMIZE";

    /** Server-side ceiling matching the frontend's 10-photo limit. */
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

    /** Free-text size (e.g. "M", "42", "10x8 ft"), or SellerDTO.CUSTOM_SIZE, or null if not applicable. */
    private String productSize;

    /** Up to MAX_PRODUCT_IMAGES base64 data-URL strings (e.g. "data:image/jpeg;base64,..."). */
    private List<String> productImages;

    @NotNull(message = "Rules are required")
    private SellerRule rules;

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

    public String getProductSize() {
        return productSize;
    }

    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }

    public List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<String> productImages) {
        this.productImages = productImages;
    }

    public SellerRule getRules() {
        return rules;
    }

    public void setRules(SellerRule rules) {
        this.rules = rules;
    }
}