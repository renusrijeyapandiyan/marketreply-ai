package com.marketreply.dto;

import java.util.List;

/**
 * What a BUYER may see about a product. Deliberately has no minimum price, no maximum discount,
 * no negotiation style and no private seller notes.
 */
public class ProductPublicDTO {

    private String id;
    private String sellerName;
    private String productName;
    private String productDescription;
    private String category;
    private Double listedPrice;
    private Integer stock;
    private boolean negotiable;

    /** Marketplace list responses carry only the cover photo; the detail response carries all. */
    private String thumbnail;
    private List<String> productImages;

    private boolean deliveryAvailable;
    private boolean pickupAvailable;
    private Double deliveryCharge;
    private Double freeDeliveryAbove;
    private Integer estimatedDeliveryDays;
    private List<String> deliveryLocations;
    private String pickupAddress;
    private List<String> acceptedPaymentMethods;
    private String returnPolicy;
    private String warranty;

    private Double averageRating;
    private long reviewCount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

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

    public boolean isNegotiable() { return negotiable; }
    public void setNegotiable(boolean negotiable) { this.negotiable = negotiable; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public List<String> getProductImages() { return productImages; }
    public void setProductImages(List<String> productImages) { this.productImages = productImages; }

    public boolean isDeliveryAvailable() { return deliveryAvailable; }
    public void setDeliveryAvailable(boolean deliveryAvailable) { this.deliveryAvailable = deliveryAvailable; }

    public boolean isPickupAvailable() { return pickupAvailable; }
    public void setPickupAvailable(boolean pickupAvailable) { this.pickupAvailable = pickupAvailable; }

    public Double getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(Double deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public Double getFreeDeliveryAbove() { return freeDeliveryAbove; }
    public void setFreeDeliveryAbove(Double freeDeliveryAbove) { this.freeDeliveryAbove = freeDeliveryAbove; }

    public Integer getEstimatedDeliveryDays() { return estimatedDeliveryDays; }
    public void setEstimatedDeliveryDays(Integer estimatedDeliveryDays) { this.estimatedDeliveryDays = estimatedDeliveryDays; }

    public List<String> getDeliveryLocations() { return deliveryLocations; }
    public void setDeliveryLocations(List<String> deliveryLocations) { this.deliveryLocations = deliveryLocations; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public List<String> getAcceptedPaymentMethods() { return acceptedPaymentMethods; }
    public void setAcceptedPaymentMethods(List<String> acceptedPaymentMethods) { this.acceptedPaymentMethods = acceptedPaymentMethods; }

    public String getReturnPolicy() { return returnPolicy; }
    public void setReturnPolicy(String returnPolicy) { this.returnPolicy = returnPolicy; }

    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public long getReviewCount() { return reviewCount; }
    public void setReviewCount(long reviewCount) { this.reviewCount = reviewCount; }
}
