package com.marketreply.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String paymentMethod;

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}