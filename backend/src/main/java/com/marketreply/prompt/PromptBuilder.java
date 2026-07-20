package com.marketreply.prompt;

import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;

/**
 * Assembles the final prompt text sent to Gemini by combining the fixed
 * system role and output contract with the seller's product/rules and the
 * buyer's message.
 */
public class PromptBuilder {

    public PromptTemplate build(Seller seller, String buyerMessage) {
        StringBuilder sb = new StringBuilder();
        sb.append(PromptConstants.SYSTEM_ROLE).append("\n\n");

        sb.append("SELLER PROFILE\n");
        sb.append("Product: ").append(nullSafe(seller.getProductName())).append("\n");
        sb.append("Description: ").append(nullSafe(seller.getProductDescription())).append("\n");
        sb.append("Size: ").append(describeSize(seller.getProductSize())).append("\n");
        sb.append("Listed price: ").append(seller.getListedPrice()).append("\n\n");

        SellerRule rules = seller.getRules();
        sb.append("SELLER RULES\n");
        if (rules != null) {
            sb.append("Minimum acceptable price: ").append(rules.getMinPrice()).append("\n");
            sb.append("Delivery available: ").append(rules.getDeliveryAvailable()).append("\n");
            sb.append("Pickup available: ").append(rules.getPickupAvailable()).append("\n");
            sb.append("Accepted payment methods: ")
                    .append(rules.getAcceptedPaymentMethods() != null ? rules.getAcceptedPaymentMethods() : "any")
                    .append("\n");
            sb.append("Max delivery distance (km): ")
                    .append(rules.getMaxDeliveryDistanceKm() != null ? rules.getMaxDeliveryDistanceKm() : "n/a")
                    .append("\n");
            sb.append("Negotiation style: ").append(nullSafe(rules.getNegotiationStyle())).append("\n");
            if (rules.getAdditionalNotes() != null && !rules.getAdditionalNotes().isBlank()) {
                sb.append("Additional notes: ").append(rules.getAdditionalNotes()).append("\n");
            }
        } else {
            sb.append("No specific rules provided; use reasonable, polite defaults.\n");
        }

        sb.append("\nBUYER MESSAGE\n\"").append(buyerMessage).append("\"\n\n");
        sb.append("TASK\n");
        sb.append("1. Identify the buyer's primary intent.\n");
        sb.append("2. Extract any offered price, requested payment method, delivery/pickup request, and timing.\n");
        sb.append("3. Compare the request against the seller's rules and list any violations.\n");
        sb.append("4. Write a short, polite, professional reply (2-4 sentences) in the seller's voice that ");
        sb.append("addresses the buyer's request, honors the rules, and moves the sale forward. ");
        sb.append("If the offer violates a rule (e.g. price below minimum), politely counter rather than accept.\n\n");
        sb.append(PromptConstants.OUTPUT_CONTRACT);

        return new PromptTemplate(sb.toString());
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }

    private String describeSize(String productSize) {
        if (productSize == null || productSize.isBlank()) {
            return "not specified";
        }
        if ("CUSTOMIZE".equalsIgnoreCase(productSize)) {
            return "made/sized to order (buyer can request a custom size)";
        }
        return productSize;
    }
}