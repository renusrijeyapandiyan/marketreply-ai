package com.marketreply.service;

import com.marketreply.model.AIAnalysis;
import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RuleBasedAnalyzer {

    private static final String RUPEE = "\u20B9";

    private static final String NUM_K = "([0-9][0-9,]*(?:\\.[0-9]+)?)(k\\b)?";
    private static final int FLAGS = Pattern.CASE_INSENSITIVE;

    private static final Pattern PRICE_CURRENCY_FIRST = Pattern.compile(
            "(?:" + RUPEE + "|\\brs\\.?|\\binr\\b|\\brupees?\\b)\\s*" + NUM_K, FLAGS);
    private static final Pattern PRICE_CURRENCY_LAST = Pattern.compile(
            NUM_K + "\\s*(?:" + RUPEE + "|\\brs\\b\\.?|\\binr\\b|\\brupees?\\b|/-)", FLAGS);
    private static final Pattern PRICE_PREPOSITION = Pattern.compile(
            "(?:\\bfor|\\bat|\\baround|\\babout|@|\\bpay(?:ing)?|\\boffer(?:ing)?|\\bgive|\\btake|\\bbudget(?: is)?)\\s*" + NUM_K
                    + "(?!\\s*(?:days?|hours?|hrs?|pcs|pieces?|kg|km|units?|items?|nos|meters?|metres?|mins?|minutes?))(?![0-9])",
            FLAGS);

    private static final Pattern TIME = Pattern.compile(
            "\\b(today|tonight|tomorrow|day after tomorrow|this (?:morning|afternoon|evening|weekend)|asap|immediately|right now"
                    + "|within \\d+\\s*(?:hours?|hrs?|days?)|in \\d+\\s*(?:hours?|hrs?|days?)|next (?:week|day))\\b", FLAGS);

    private static final String[][] PAYMENT_GROUPS = {
            {"UPI", "upi", "gpay", "google pay", "phonepe", "paytm", "bhim"},
            {"Cash", "cash", "cod"},
            {"Card", "card", "credit", "debit"},
            {"Bank transfer", "bank", "neft", "imps", "rtgs", "net banking", "netbanking", "transfer"},
            {"EMI", "emi"},
    };

    public void enforce(Seller seller, String buyerMessage, AIAnalysis a) {
        Extracted ex = extract(buyerMessage);

        if (a.getOfferedPrice() == null) {
            a.setOfferedPrice(ex.price);
        }
        if (isBlank(a.getRequestedDeliveryMethod()) || "UNSPECIFIED".equals(a.getRequestedDeliveryMethod())) {
            a.setRequestedDeliveryMethod(ex.delivery);
        }
        if (isBlank(a.getRequestedDeliveryTime())) {
            a.setRequestedDeliveryTime(ex.time);
        }
        if (isBlank(a.getRequestedPaymentMethod())) {
            a.setRequestedPaymentMethod(ex.payment);
        }

        List<String> violations = new ArrayList<>();
        if (a.getRuleViolations() != null) {
            for (String v : a.getRuleViolations()) {
                if (!isBlank(v)) {
                    violations.add(v.trim());
                }
            }
        }
        for (Violation v : checkRules(seller, a.getOfferedPrice(), a.getRequestedDeliveryMethod(),
                a.getRequestedPaymentMethod())) {
            if (!alreadyCovered(violations, v.category)) {
                violations.add(v.text);
            }
        }
        a.setRuleViolations(violations);
        a.setCompliesWithRules(violations.isEmpty());

        if (a.getExtractedEntities() == null || a.getExtractedEntities().isEmpty()) {
            a.setExtractedEntities(entities(a));
        }
    }

    public AIAnalysis analyze(Seller seller, String buyerMessage) {
        Extracted ex = extract(buyerMessage);
        String lower = buyerMessage == null ? "" : buyerMessage.toLowerCase(Locale.ROOT);

        AIAnalysis a = new AIAnalysis();
        a.setOfferedPrice(ex.price);
        a.setRequestedDeliveryMethod(ex.delivery);
        a.setRequestedDeliveryTime(ex.time);
        a.setRequestedPaymentMethod(ex.payment);
        a.setIntent(detectIntent(lower, ex));
        a.setSentiment(detectSentiment(lower));
        a.setExtractedEntities(entities(a));
        a.setRuleViolations(new ArrayList<>());
        a.setSuggestedReply(buildReply(seller, a));
        enforce(seller, buyerMessage, a);
        return a;
    }

    public String buildReply(Seller seller, AIAnalysis a) {
        SellerRule rules = seller.getRules();
        String product = isBlank(seller.getProductName()) ? "item" : seller.getProductName().trim();
        List<String> parts = new ArrayList<>();
        parts.add("Hi! Thanks for your interest in the " + product + ".");

        boolean addressed = false;

        Double offered = a.getOfferedPrice();
        if (offered != null) {
            addressed = true;
            Double min = rules != null ? rules.getMinPrice() : null;
            Double listed = seller.getListedPrice();
            if (min != null && offered < min) {
                double counter = (listed != null && listed > min) ? ceilToTen((listed + min) / 2.0) : min;
                parts.add(money(offered) + " is a bit lower than I can accept, but I can do " + money(counter) + ".");
            } else if (min != null) {
                parts.add("Your offer of " + money(offered) + " works for me.");
            } else if (listed != null && offered < listed) {
                parts.add("The listed price is " + money(listed) + ". I'll see what I can do for "
                        + money(offered) + " - could you stretch it a little?");
            } else {
                parts.add("Thanks for your offer of " + money(offered) + ".");
            }
        }

        String method = a.getRequestedDeliveryMethod();
        String time = a.getRequestedDeliveryTime();
        if ("DELIVERY".equals(method)) {
            addressed = true;
            if (rules != null && Boolean.FALSE.equals(rules.getDeliveryAvailable())) {
                parts.add("Unfortunately I don't offer delivery for this item"
                        + (rules.getPickupAvailable() == null || rules.getPickupAvailable()
                        ? ", but you're welcome to pick it up." : "."));
            } else if (!isBlank(time)) {
                parts.add("I can arrange delivery - could you share your area or pincode so I can confirm whether "
                        + time + " is possible?");
            } else {
                parts.add("Delivery is available - please share your area or pincode so I can confirm the timing.");
            }
        } else if ("PICKUP".equals(method)) {
            addressed = true;
            if (rules != null && Boolean.FALSE.equals(rules.getPickupAvailable())) {
                parts.add("Pickup isn't available for this item"
                        + (rules.getDeliveryAvailable() == null || rules.getDeliveryAvailable()
                        ? ", but I can arrange delivery." : "."));
            } else {
                parts.add("Pickup works - let me know when you'd like to come by.");
            }
        }

        if (!isBlank(a.getRequestedPaymentMethod())) {
            addressed = true;
            if (rules != null && !paymentAccepted(rules, a.getRequestedPaymentMethod())) {
                parts.add("I don't accept " + a.getRequestedPaymentMethod() + "; I can take "
                        + String.join(", ", rules.getAcceptedPaymentMethods()) + ".");
            } else {
                parts.add(a.getRequestedPaymentMethod() + " is fine.");
            }
        }

        if (!addressed) {
            if ("CONFIRM_PURCHASE".equals(a.getIntent())) {
                parts.add("Great, I'd be happy to proceed. Please share your delivery address and preferred payment method.");
            } else if ("ASK_AVAILABILITY".equals(a.getIntent())) {
                parts.add("Let me confirm the current availability and get back to you shortly.");
            } else {
                parts.add("Could you tell me a little more about what you'd like to know?");
            }
        }
        return String.join(" ", parts);
    }

    private List<Violation> checkRules(Seller seller, Double offered, String method, String payment) {
        List<Violation> out = new ArrayList<>();
        SellerRule rules = seller.getRules();
        if (rules == null) {
            return out;
        }

        Double min = rules.getMinPrice();
        if (offered != null && min != null && offered < min) {
            out.add(new Violation("price", "Offered price " + money(offered)
                    + " is below your minimum acceptable price of " + money(min) + "."));
        }
        if ("DELIVERY".equals(method) && Boolean.FALSE.equals(rules.getDeliveryAvailable())) {
            out.add(new Violation("delivery", "Buyer wants delivery, but delivery is not available for this listing."));
        }
        if ("PICKUP".equals(method) && Boolean.FALSE.equals(rules.getPickupAvailable())) {
            out.add(new Violation("pickup", "Buyer wants pickup, but pickup is not available for this listing."));
        }
        if (!isBlank(payment) && !paymentAccepted(rules, payment)) {
            out.add(new Violation("payment", "Payment method \"" + payment + "\" is not in your accepted methods ("
                    + String.join(", ", rules.getAcceptedPaymentMethods()) + ")."));
        }
        return out;
    }

    private boolean paymentAccepted(SellerRule rules, String requested) {
        List<String> accepted = rules.getAcceptedPaymentMethods();
        if (accepted == null || accepted.isEmpty()) {
            return true;
        }
        String req = requested.toLowerCase(Locale.ROOT);
        String acc = String.join(" | ", accepted).toLowerCase(Locale.ROOT);

        for (String[] group : PAYMENT_GROUPS) {
            boolean reqInGroup = containsAny(req, group);
            if (reqInGroup) {
                return containsAny(acc, group);
            }
        }
        return acc.contains(req);
    }

    private boolean containsAny(String haystack, String[] group) {
        for (int i = 1; i < group.length; i++) {
            if (Pattern.compile("\\b" + Pattern.quote(group[i]) + "\\b").matcher(haystack).find()) {
                return true;
            }
        }
        return false;
    }

    private boolean alreadyCovered(List<String> existing, String category) {
        String[] keys;
        switch (category) {
            case "price" -> keys = new String[]{"price", "minimum", "offer"};
            case "delivery" -> keys = new String[]{"deliver"};
            case "pickup" -> keys = new String[]{"pickup", "pick up", "pick-up"};
            default -> keys = new String[]{"payment", "pay "};
        }
        for (String v : existing) {
            String l = v.toLowerCase(Locale.ROOT);
            for (String k : keys) {
                if (l.contains(k)) {
                    return true;
                }
            }
        }
        return false;
    }

    private Extracted extract(String message) {
        Extracted ex = new Extracted();
        if (message == null) {
            return ex;
        }
        String lower = message.toLowerCase(Locale.ROOT);

        ex.price = firstPrice(message);

        boolean wantsDelivery = containsWord(lower, "deliver", "delivery", "ship", "shipping", "courier", "send it", "home delivery");
        boolean wantsPickup = containsWord(lower, "pickup", "pick up", "pick-up", "collect", "come and take", "i will come", "i'll come");
        if (wantsDelivery && !wantsPickup) {
            ex.delivery = "DELIVERY";
        } else if (wantsPickup && !wantsDelivery) {
            ex.delivery = "PICKUP";
        }

        Matcher t = TIME.matcher(message);
        if (t.find()) {
            ex.time = t.group(1).toLowerCase(Locale.ROOT);
        }

        for (String[] group : PAYMENT_GROUPS) {
            if (containsAny(lower, group)) {
                ex.payment = group[0].equals("Cash") && lower.contains("cash on delivery")
                        ? "Cash on delivery" : group[0];
                break;
            }
        }
        return ex;
    }

    private Double firstPrice(String message) {
        for (Pattern p : new Pattern[]{PRICE_CURRENCY_FIRST, PRICE_CURRENCY_LAST, PRICE_PREPOSITION}) {
            Matcher m = p.matcher(message);
            while (m.find()) {
                Double value = parseAmount(m.group(1), m.group(2) != null);
                if (value != null && (p != PRICE_PREPOSITION || value >= 10)) {
                    return value;
                }
            }
        }
        return null;
    }

    private Double parseAmount(String digits, boolean thousand) {
        try {
            double v = Double.parseDouble(digits.replace(",", ""));
            return thousand ? v * 1000 : v;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String detectIntent(String lower, Extracted ex) {
        if (ex.price != null || containsWord(lower, "discount", "less", "lower", "reduce", "negotiat",
                "best price", "last price", "final price", "bargain", "cheaper")) {
            return "NEGOTIATE_PRICE";
        }
        if (ex.payment != null) {
            return "ASK_PAYMENT";
        }
        if (!"UNSPECIFIED".equals(ex.delivery) || ex.time != null) {
            return "ASK_DELIVERY";
        }
        if (containsWord(lower, "available", "in stock", "stock", "still have", "still there")) {
            return "ASK_AVAILABILITY";
        }
        if (containsWord(lower, "i'll take", "i will take", "i want to buy", "buy it", "place order",
                "confirm", "book it", "deal")) {
            return "CONFIRM_PURCHASE";
        }
        return lower.contains("?") ? "GENERAL_QUESTION" : "OTHER";
    }

    private String detectSentiment(String lower) {
        if (containsWord(lower, "scam", "fraud", "cheat", "worst", "terrible", "angry", "useless")) {
            return "NEGATIVE";
        }
        if (containsWord(lower, "thanks", "thank you", "great", "love", "interested", "please", "nice")) {
            return "POSITIVE";
        }
        return "NEUTRAL";
    }

    private List<String> entities(AIAnalysis a) {
        List<String> list = new ArrayList<>();
        if (a.getOfferedPrice() != null) {
            list.add("Price: " + money(a.getOfferedPrice()));
        }
        if (!isBlank(a.getRequestedDeliveryMethod()) && !"UNSPECIFIED".equals(a.getRequestedDeliveryMethod())) {
            list.add("Method: " + a.getRequestedDeliveryMethod().toLowerCase(Locale.ROOT));
        }
        if (!isBlank(a.getRequestedDeliveryTime())) {
            list.add("Time: " + a.getRequestedDeliveryTime());
        }
        if (!isBlank(a.getRequestedPaymentMethod())) {
            list.add("Payment: " + a.getRequestedPaymentMethod());
        }
        return list;
    }

    private boolean containsWord(String lower, String... needles) {
        for (String n : needles) {
            if (Pattern.compile("\\b" + Pattern.quote(n)).matcher(lower).find()) {
                return true;
            }
        }
        return false;
    }

    private double ceilToTen(double v) {
        return Math.ceil(v / 10.0) * 10.0;
    }

    private String money(double v) {
        return RUPEE + (v == Math.floor(v) ? String.valueOf((long) v) : String.format(Locale.ROOT, "%.2f", v));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static final class Extracted {
        Double price;
        String delivery = "UNSPECIFIED";
        String time;
        String payment;
    }

    private record Violation(String category, String text) {
    }
}