package com.marketreply.dto;

import jakarta.validation.constraints.NotNull;
import com.marketreply.model.OrderStatus;

/** Payload the seller submits to move an order to a new status. */
public class UpdateOrderStatusRequest {

    @NotNull(message = "status is required")
    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}