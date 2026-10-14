package com.marketreply.dto;

import java.util.List;
import java.util.Map;

/** Numbers for the Seller Hub dashboard. */
public class SellerDashboardDTO {

    private long productCount;
    private long totalOrders;
    private long pendingOrders;
    private double revenue;
    private long chatCount;
    private long negotiatedOrders;
    private double averageDiscountPercent;
    private Map<String, Long> ordersByStatus;
    private List<OrderDTO> recentOrders;
    private List<ChatSummaryDTO> recentChats;

    public long getProductCount() { return productCount; }
    public void setProductCount(long productCount) { this.productCount = productCount; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }

    public long getChatCount() { return chatCount; }
    public void setChatCount(long chatCount) { this.chatCount = chatCount; }

    public long getNegotiatedOrders() { return negotiatedOrders; }
    public void setNegotiatedOrders(long negotiatedOrders) { this.negotiatedOrders = negotiatedOrders; }

    public double getAverageDiscountPercent() { return averageDiscountPercent; }
    public void setAverageDiscountPercent(double averageDiscountPercent) { this.averageDiscountPercent = averageDiscountPercent; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public List<OrderDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDTO> recentOrders) { this.recentOrders = recentOrders; }

    public List<ChatSummaryDTO> getRecentChats() { return recentChats; }
    public void setRecentChats(List<ChatSummaryDTO> recentChats) { this.recentChats = recentChats; }
}
