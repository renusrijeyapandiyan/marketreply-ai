package com.marketreply.negotiation;

import com.marketreply.model.ChatSession;
import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;

/**
 * Decides every price the assistant states. The language model is only asked to PHRASE the result,
 * so it can never invent a price, and it never even sees the seller's minimum price.
 *
 * Rules:
 *  - An offer at or above the minimum acceptable price is accepted (at the offer, capped at the list price).
 *  - A lower offer gets a counter-offer that walks down from the list price toward the minimum.
 *    How fast depends on the seller's negotiation style. The counter is never below the minimum.
 *  - Once the counter reaches the minimum it is flagged as the final price.
 */
public final class NegotiationEngine {

    public enum Type { ACCEPT, COUNTER, HOLD }

    public static final class Decision {
        public final Type type;
        public final double price;
        public final boolean finalPrice;

        Decision(Type type, double price, boolean finalPrice) {
            this.type = type;
            this.price = price;
            this.finalPrice = finalPrice;
        }
    }

    private static final int MAX_ROUNDS_BEFORE_FINAL = 4;

    private NegotiationEngine() {
    }

    public static double floor(Seller seller) {
        double listed = listed(seller);
        SellerRule r = seller.getRules();
        if (r == null || r.getMinPrice() == null) {
            return listed;
        }
        return Math.min(listed, Math.max(0, r.getMinPrice()));
    }

    private static double listed(Seller seller) {
        return seller.getListedPrice() != null ? seller.getListedPrice() : 0;
    }

    /** @param offer the buyer's proposed unit price, or null when they only asked for a discount */
    public static Decision decideOnOffer(Seller seller, ChatSession session, Double offer) {
        double listed = listed(seller);
        double floor = floor(seller);

        if (floor >= listed) {
            return new Decision(Type.HOLD, listed, true);
        }
        if (offer != null && offer >= listed) {
            return new Decision(Type.ACCEPT, listed, false);
        }
        if (offer != null && offer >= floor) {
            return new Decision(Type.ACCEPT, offer, false);
        }

        double base = session.getLastCounter() != null ? session.getLastCounter() : listed;
        if (base <= floor) {
            return new Decision(Type.COUNTER, floor, true);
        }

        double next = base - fraction(seller) * (base - floor);
        next = Math.ceil(next / step(listed)) * step(listed);
        if (next >= base) {
            next = base - 1;
        }
        boolean last = session.getNegotiationRounds() + 1 >= MAX_ROUNDS_BEFORE_FINAL
                || (next - floor) <= Math.max(1, listed * 0.01);
        if (last || next <= floor) {
            next = floor;
            last = true;
        }
        return new Decision(Type.COUNTER, next, last);
    }

    /** The buyer said "ok / deal" to the standing price. */
    public static Decision decideOnAcceptance(Seller seller, ChatSession session) {
        double price = session.getLastCounter() != null ? session.getLastCounter() : listed(seller);
        price = Math.max(price, floor(seller));
        return new Decision(Type.ACCEPT, Math.min(price, listed(seller)), false);
    }

    /** Buyer wants to buy without negotiating: the standing price, or the list price. */
    public static Decision decideOnPlainPurchase(Seller seller, ChatSession session) {
        if (session.getAgreedPrice() != null) {
            return new Decision(Type.ACCEPT, session.getAgreedPrice(), false);
        }
        return new Decision(Type.ACCEPT, listed(seller), false);
    }

    private static double fraction(Seller seller) {
        String style = seller.getRules() != null ? seller.getRules().getNegotiationStyle() : null;
        if (style == null) {
            return 0.35;
        }
        switch (style.toUpperCase()) {
            case "FLEXIBLE": return 0.5;
            case "FIRM": return 0.2;
            default: return 0.35;
        }
    }

    private static double step(double listed) {
        if (listed >= 5000) return 50;
        if (listed >= 500) return 10;
        return 1;
    }

    /** Applies a decision to the session (single place that mutates negotiation state). */
    public static void apply(ChatSession session, Decision d, boolean counted) {
        if (d.type == Type.ACCEPT) {
            session.setAgreedPrice(d.price);
            session.setLastCounter(d.price);
            session.setFinalPrice(true);
        } else {
            session.setLastCounter(d.price);
            session.setFinalPrice(d.finalPrice);
            if (counted) {
                session.setNegotiationRounds(session.getNegotiationRounds() + 1);
            }
        }
    }
}
