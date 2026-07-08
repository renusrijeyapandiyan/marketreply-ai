package com.marketreply.model;

/**
 * The set of business rules a seller wants enforced when Gemini evaluates
 * an incoming buyer message. Embedded inside Seller.
 */
public class SellerRule {

    private Double minPrice;
    private Boolean deliveryAvailable;
    private Boolean pickupAvailable;
    private java.util.List<String> acceptedPaymentMethods;
    private Integer maxDeliveryDistanceKm;
    private String negotiationStyle; // e.g. FLEXIBLE, FIRM, MODERATE
    private String additionalNotes;

    public SellerRule() {
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Boolean getDeliveryAvailable() {
        return deliveryAvailable;
    }

    public void setDeliveryAvailable(Boolean deliveryAvailable) {
        this.deliveryAvailable = deliveryAvailable;
    }

    public Boolean getPickupAvailable() {
        return pickupAvailable;
    }

    public void setPickupAvailable(Boolean pickupAvailable) {
        this.pickupAvailable = pickupAvailable;
    }

    public java.util.List<String> getAcceptedPaymentMethods() {
        return acceptedPaymentMethods;
    }

    public void setAcceptedPaymentMethods(java.util.List<String> acceptedPaymentMethods) {
        this.acceptedPaymentMethods = acceptedPaymentMethods;
    }

    public Integer getMaxDeliveryDistanceKm() {
        return maxDeliveryDistanceKm;
    }

    public void setMaxDeliveryDistanceKm(Integer maxDeliveryDistanceKm) {
        this.maxDeliveryDistanceKm = maxDeliveryDistanceKm;
    }

    public String getNegotiationStyle() {
        return negotiationStyle;
    }

    public void setNegotiationStyle(String negotiationStyle) {
        this.negotiationStyle = negotiationStyle;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
}
