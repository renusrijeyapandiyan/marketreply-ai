package com.marketreply.model;

import java.time.Instant;

/** One line item inside a buyer's cart — embedded inside Cart, not its own collection. */
public class CartItem {

    private String sellerId;
    private String productName;
    private Double listedPrice;
    private String thumbnailImage;
    private int quantity;
    private Instant addedAt = Instant.now();

    public CartItem() {
    }

    public CartItem(String sellerId, String productName, Double listedPrice, String thumbnailImage, int quantity) {
        this.sellerId = sellerId;
        this.productName = productName;
        this.listedPrice = listedPrice;
        this.thumbnailImage = thumbnailImage;
        this.quantity = quantity;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getListedPrice() {
        return listedPrice;
    }

    public void setListedPrice(Double listedPrice) {
        this.listedPrice = listedPrice;
    }

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Instant getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Instant addedAt) {
        this.addedAt = addedAt;
    }
}