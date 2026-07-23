package com.marketreply.prompt;

import com.marketreply.dto.ChatTurnDTO;
import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;

import java.util.List;

public class PromptBuilder {

    public PromptTemplate build(Seller seller, String buyerMessage, List<ChatTurnDTO> history) {
        StringBuilder sb = new StringBuilder();
        sb.append(PromptConstants.SYSTEM_ROLE).append("\n\n");

        sb.append("SELLER PROFILE\n");
        sb.append("Product: ").append(nullSafe(seller.getProductName())).append("\n");
        sb.append("Description: ").append(nullSafe(seller.getProductDescription())).append("\n");
        sb.append("Size: ").append(describeSize(seller.getProductSize())).append("\n");
        sb.append("Listed price: ").append(seller.getListedPrice()).append("\n\n");

        SellerRule rules = seller.getRules();
        sb.append("SELLER RULES (CONFIDENTIAL — for your evaluation only, see rule 7 below)\n");
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

        if (history != null && !history.isEmpty()) {
            sb.append("\nCONVERSATION SO FAR (oldest first)\n");
            for (ChatTurnDTO turn : history) {
                sb.append("Buyer: ").append(nullSafe(turn.getBuyerMessage())).append("\n");
                if (turn.getSuggestedReply() != null && !turn.getSuggestedReply().isBlank()) {
                    sb.append("Seller: ").append(turn.getSuggestedReply()).append("\n");
                }
            }
        }

        sb.append("\nBUYER'S LATEST MESSAGE\n\"").append(buyerMessage).append("\"\n\n");
        sb.append("TASK\n");
        sb.append("1. Identify the buyer's primary intent for this latest message.\n");
        sb.append("2. Extract any offered price, requested payment method, delivery/pickup request, and timing ");
        sb.append("mentioned in the latest message (reuse earlier details from the conversation only if the buyer ");
        sb.append("is clearly still referring to them).\n");
        sb.append("3. If the buyer's offered price is at or above the minimum acceptable price, treat it as ");
        sb.append("compliant and accept it warmly in your reply — do not counter-offer or push for more.\n");
        sb.append("4. If the offered price is below the minimum, it does not comply. Politely decline and counter ");
        sb.append("with a specific price at or above the minimum, but frame it naturally (e.g. \"I could do ₹X\") — ");
        sb.append("as if it's your judgment call, not a fixed floor.\n");
        sb.append("5. Compare delivery/pickup/payment requests against the seller's rules and list any violations.\n");
        sb.append("6. Write a short, polite, professional reply (2-4 sentences) in the seller's voice that continues ");
        sb.append("the conversation naturally — don't repeat information already given earlier in the thread.\n");
        sb.append("7. STRICT CONFIDENTIALITY RULE: The exact minimum acceptable price is private seller information. ");
        sb.append("NEVER state, imply, or hint at the minimum acceptable price number anywhere in your output — not in ");
        sb.append("suggestedReply, and not in ruleViolations. Do not say things like \"your offer is below my minimum of ₹X\" ");
        sb.append("or \"I need at least ₹X\" as a stated floor. Instead, phrase any price rejection purely as your own ");
        sb.append("counter-offer or a general \"that's a bit low for me\" — the buyer must never be able to learn the ");
        sb.append("exact minimum from your reply or from ruleViolations. When describing a price rule violation in ");
        sb.append("ruleViolations, phrase it generically, e.g. \"Offered price is below what the seller can accept\" — ");
        sb.append("with no number attached.\n");
        sb.append("8. Set orderReady to true ONLY if the buyer has just given a clear, unambiguous confirmation to ");
        sb.append("purchase under terms that comply with the seller's rules (e.g. \"I'll take it\", \"yes, let's do it\", ");
        sb.append("\"confirmed, I'll pay now\"). Do NOT set it true just because a price was mentioned or discussed — ");
        sb.append("only on explicit confirmation. If terms do not comply with the rules, orderReady must be false ");
        sb.append("even if the buyer says yes.\n");
        sb.append("9. If the buyer has given a delivery address at any point in this conversation, extract it into ");
        sb.append("deliveryAddress; otherwise null.\n\n");
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