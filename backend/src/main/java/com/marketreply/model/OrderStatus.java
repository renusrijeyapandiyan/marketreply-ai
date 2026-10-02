package com.marketreply.model;

/** Lifecycle states for an Order, roughly in the order a seller would move through them. */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}