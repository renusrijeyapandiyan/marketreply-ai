package com.marketreply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * A marketplace seller profile: identity, the product being sold, and the
 * rules Gemini must respect when drafting replies to buyers.
 */
@Document(collection = "sellers")
public class Seller {

    @Id
    private String id;

    private String ownerId;

    private String name;
    private String email;
    private String productName;
    private String productDescription;
    private Double listedPrice;
    private String productSize;
    private java.util.List<String> productImages;
    private SellerRule rules;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Seller() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
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

    public java.util.List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(java.util.List<String> productImages) {
        this.productImages = productImages;
    }

    public SellerRule getRules() {
        return rules;
    }

    public void setRules(SellerRule rules) {
        this.rules = rules;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}