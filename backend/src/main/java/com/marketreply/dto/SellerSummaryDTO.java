package com.marketreply.dto;

import com.marketreply.model.SellerRule;

/** Lightweight seller listing for marketplace/browse views — one thumbnail, not the full gallery. */
public class SellerSummaryDTO {

    private String id;
    private String name;
    private String email;
    private String productName;
    private String productDescription;
    private Double listedPrice;
    private String productSize;
    private String thumbnailImage;
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

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    public SellerRule getRules() {
        return rules;
    }

    public void setRules(SellerRule rules) {
        this.rules = rules;
    }
}