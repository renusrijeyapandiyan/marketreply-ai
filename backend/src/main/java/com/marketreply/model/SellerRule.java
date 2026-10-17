package com.marketreply.model;

import java.util.List;

/**
 * Everything a seller decides about how a product is sold. Embedded inside Seller.
 *
 * PRICING
 *   Seller.listedPrice          - the selling price shown to buyers
 *   maxDiscountPercent          - the most the AI assistant may knock off the listed price
 *   minPrice                    - the minimum acceptable price. It is ALWAYS derived as
 *                                 listedPrice - maxDiscountPercent% (see SellerService), and it is
 *                                 never sent to buyers or to the language model.
 *
 * DELIVERY / PAYMENT
 *   deliveryAvailable, pickupAvailable, deliveryCharge, freeDeliveryAbove, estimatedDeliveryDays,
 *   deliveryLocations (cities / areas / pincodes served), pickupAddress, acceptedPaymentMethods
 */
public class SellerRule {

    // ---- pricing -------------------------------------------------------
    private Double maxDiscountPercent;
    private Double minPrice;
    private String negotiationStyle; // FLEXIBLE, MODERATE, FIRM

    // ---- delivery ------------------------------------------------------
    private Boolean deliveryAvailable;
    private Boolean pickupAvailable;
    private Double deliveryCharge;
    private Double freeDeliveryAbove;
    private Integer estimatedDeliveryDays;
    private List<String> deliveryLocations;
    private String pickupAddress;
    private Integer maxDeliveryDistanceKm;

    // ---- payment & policies --------------------------------------------
    private List<String> acceptedPaymentMethods;
    private String returnPolicy;
    private String warranty;

    /** Private instructions for the AI assistant (never shown to buyers). */
    private String additionalNotes;

    public SellerRule() {
    }

    public Double getMaxDiscountPercent() { return maxDiscountPercent; }
    public void setMaxDiscountPercent(Double maxDiscountPercent) { this.maxDiscountPercent = maxDiscountPercent; }

    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public String getNegotiationStyle() { return negotiationStyle; }
    public void setNegotiationStyle(String negotiationStyle) { this.negotiationStyle = negotiationStyle; }

    public Boolean getDeliveryAvailable() { return deliveryAvailable; }
    public void setDeliveryAvailable(Boolean deliveryAvailable) { this.deliveryAvailable = deliveryAvailable; }

    public Boolean getPickupAvailable() { return pickupAvailable; }
    public void setPickupAvailable(Boolean pickupAvailable) { this.pickupAvailable = pickupAvailable; }

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

    public Integer getMaxDeliveryDistanceKm() { return maxDeliveryDistanceKm; }
    public void setMaxDeliveryDistanceKm(Integer maxDeliveryDistanceKm) { this.maxDeliveryDistanceKm = maxDeliveryDistanceKm; }

    public List<String> getAcceptedPaymentMethods() { return acceptedPaymentMethods; }
    public void setAcceptedPaymentMethods(List<String> acceptedPaymentMethods) { this.acceptedPaymentMethods = acceptedPaymentMethods; }

    public String getReturnPolicy() { return returnPolicy; }
    public void setReturnPolicy(String returnPolicy) { this.returnPolicy = returnPolicy; }

    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
}
