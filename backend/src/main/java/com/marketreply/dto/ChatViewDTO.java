package com.marketreply.dto;

import com.marketreply.model.ChatMessage;

import java.util.List;

/** Everything the chat UI needs: transcript, live price state, order draft and (once placed) the order. */
public class ChatViewDTO {

    private String sessionId;
    private String sellerId;
    private String stage;
    private List<ChatMessage> messages;
    private Double listedPrice;
    private Double currentOffer;
    private Double agreedPrice;
    private boolean finalPrice;
    private Integer quantity;
    private String deliveryMethod;
    private String deliveryAddress;
    private String paymentMethod;
    private String buyerPhone;
    private List<String> missing;
    private Double unitPrice;
    private Double subtotal;
    private Double deliveryCharge;
    private Double total;
    private OrderDTO order;
    private List<String> quickReplies;
    private boolean aiFallback;

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }

    public Double getListedPrice() { return listedPrice; }
    public void setListedPrice(Double listedPrice) { this.listedPrice = listedPrice; }

    public Double getCurrentOffer() { return currentOffer; }
    public void setCurrentOffer(Double currentOffer) { this.currentOffer = currentOffer; }

    public Double getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(Double agreedPrice) { this.agreedPrice = agreedPrice; }

    public boolean isFinalPrice() { return finalPrice; }
    public void setFinalPrice(boolean finalPrice) { this.finalPrice = finalPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(String deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public List<String> getMissing() { return missing; }
    public void setMissing(List<String> missing) { this.missing = missing; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(Double deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public OrderDTO getOrder() { return order; }
    public void setOrder(OrderDTO order) { this.order = order; }

    public List<String> getQuickReplies() { return quickReplies; }
    public void setQuickReplies(List<String> quickReplies) { this.quickReplies = quickReplies; }

    public boolean isAiFallback() { return aiFallback; }
    public void setAiFallback(boolean aiFallback) { this.aiFallback = aiFallback; }
}
