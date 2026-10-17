package com.marketreply.negotiation;

import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/** Pure, deterministic checks of a buyer's choices against the seller's rules. No Spring, no AI. */
public final class CommerceRules {

    private CommerceRules() {
    }

    private static final String[][] PAYMENT_GROUPS = {
            {"UPI", "upi", "gpay", "google pay", "phonepe", "paytm", "bhim"},
            {"Cash on Delivery", "cod", "cash on delivery", "cash"},
            {"Card", "card", "credit", "debit"},
            {"Bank Transfer", "bank", "neft", "imps", "rtgs", "net banking", "netbanking", "transfer"},
    };

    /** Maps free text ("gpay", "cash") to a canonical group name, or the cleaned input if unknown. */
    public static String canonicalPayment(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        String t = text.toLowerCase(Locale.ROOT);
        for (String[] g : PAYMENT_GROUPS) {
            for (int i = 1; i < g.length; i++) {
                if (Pattern.compile("\\b" + Pattern.quote(g[i]) + "\\b").matcher(t).find()) {
                    return g[0];
                }
            }
        }
        return text.trim();
    }

    /**
     * Returns the seller's own label for this payment method if they accept it, otherwise null.
     * No accepted list configured means "anything goes".
     */
    public static String matchAcceptedPayment(SellerRule rules, String requested) {
        if (requested == null || requested.isBlank()) {
            return null;
        }
        List<String> accepted = rules == null ? null : rules.getAcceptedPaymentMethods();
        if (accepted == null || accepted.isEmpty()) {
            return requested.trim();
        }
        String want = canonicalPayment(requested);
        for (String a : accepted) {
            String have = canonicalPayment(a);
            if (have != null && have.equalsIgnoreCase(want)) {
                return a;
            }
        }
        return null;
    }

    /**
     * Is this address inside the seller's delivery area? When the seller listed no locations they
     * deliver anywhere (subject to distance, which we cannot verify here).
     */
    public static boolean servesLocation(SellerRule rules, String address) {
        List<String> locations = rules == null ? null : rules.getDeliveryLocations();
        if (locations == null || locations.isEmpty()) {
            return true;
        }
        if (address == null || address.isBlank()) {
            return false;
        }
        String a = address.toLowerCase(Locale.ROOT);
        for (String loc : locations) {
            if (loc != null && !loc.isBlank() && a.contains(loc.trim().toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    /** Delivery fee for a given merchandise subtotal and method. */
    public static double deliveryFee(SellerRule rules, String method, double subtotal) {
        if (rules == null || !"DELIVERY".equals(method)) {
            return 0;
        }
        double fee = rules.getDeliveryCharge() != null ? rules.getDeliveryCharge() : 0;
        Double free = rules.getFreeDeliveryAbove();
        if (free != null && free > 0 && subtotal >= free) {
            return 0;
        }
        return fee;
    }

    public static boolean inStock(Seller seller, int quantity) {
        return seller.getStock() == null || seller.getStock() >= quantity;
    }

    public static String money(double v) {
        long whole = Math.round(v);
        if (Math.abs(v - whole) < 0.005) {
            return "\u20B9" + String.format(Locale.US, "%,d", whole);
        }
        return "\u20B9" + String.format(Locale.US, "%,.2f", v);
    }
}
