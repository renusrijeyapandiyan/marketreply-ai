package com.marketreply.negotiation;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Regex-based understanding of a buyer message. This is the safety net used when the language model
 * is unavailable, and it also back-fills anything the model missed (price, phone, quantity).
 */
public final class MessageParser {

    public static final class Parsed {
        public String intent = "OTHER";
        public Double offeredPrice;
        public Integer quantity;
        public String deliveryMethod;   // DELIVERY | PICKUP
        public String deliveryAddress;
        public String paymentMethod;
        public String buyerPhone;
    }

    private MessageParser() {
    }

    private static final int F = Pattern.CASE_INSENSITIVE;
    private static final String NUM = "([0-9][0-9,]*(?:\\.[0-9]+)?)\\s*(k\\b)?";
    private static final Pattern PRICE_SYMBOL = Pattern.compile("(?:\u20B9|\\brs\\.?|\\binr\\b|\\brupees?\\b)\\s*" + NUM, F);
    private static final Pattern PRICE_SUFFIX = Pattern.compile(NUM + "\\s*(?:\u20B9|\\brs\\b\\.?|\\binr\\b|\\brupees?\\b|/-)", F);
    private static final Pattern PRICE_WORD = Pattern.compile(
            "(?:\\bfor|\\bdo|\\bmake it|\\bsettle(?: at)?|\\bcome down to|\\bat|\\baround|\\babout|@|\\bpay|\\boffer|\\bgive|\\btake|\\bbudget(?: is)?|\\bfinal|\\blast|\\bbest)\\s*(?:is\\s*)?" + NUM
                    + "(?!\\s*(?:days?|hours?|hrs?|pcs|pieces?|units?|items?|nos|km|kg|mins?|minutes?))(?![0-9])", F);
    private static final Pattern BARE_NUMBER = Pattern.compile("^\\s*(?:\u20B9|rs\\.?)?\\s*" + NUM + "\\s*(?:/-|rs|rupees)?\\s*[?.!]*\\s*$", F);
    private static final Pattern PHONE = Pattern.compile("(?<![0-9])(?:\\+?91[\\s-]?)?([6-9][0-9]{9})(?![0-9])");
    private static final Pattern QTY = Pattern.compile(
            "(?:\\bqty\\b|\\bquantity\\b|\\bx\\s*)\\s*[:=]?\\s*([0-9]{1,3})\\b|\\b([0-9]{1,3})\\s*(?:pcs|pieces?|units?|items?|nos|numbers?)\\b|\\b(?:buy|take|need|want|order)\\s+([0-9]{1,3})\\b(?!\\s*(?:k\\b|rs|\u20B9))", F);

    private static final Pattern ADDRESS_AFTER = Pattern.compile(
            "(?:\\bdeliver(?:ed|y)?\\s+(?:it\\s+)?(?:to|at)|\\bsend\\s+(?:it\\s+)?to|\\bship\\s+(?:it\\s+)?to|\\bmy address is|\\baddress\\s*(?:is|:)|\\bdelivery address\\s*(?:is|:)?)\\s*:?\\s*(.+)$", F);
    private static final Pattern ADDRESS_STOP = Pattern.compile(
            "[,;.]?\\s*\\b(?:and\\s+)?(?:pay(?:ing|ment)?\\b|by (?:upi|cash|card)|my (?:number|phone|mobile)|phone|mobile|contact)\\b.*$", F);

    /** True when free text plausibly is a postal address (used when we are waiting for one). */
    public static boolean looksLikeAddress(String text) {
        if (text == null) return false;
        String t = text.trim();
        if (t.length() < 10 || t.endsWith("?")) return false;
        boolean hasDigit = t.matches(".*[0-9].*");
        boolean hasSep = t.contains(",") || t.split("\\s+").length >= 4;
        return hasDigit && hasSep || t.split("\\s+").length >= 4 && t.contains(",");
    }

    public static Parsed parse(String message) {
        Parsed p = new Parsed();
        if (message == null) {
            return p;
        }
        String m = message.trim();
        String lower = m.toLowerCase(Locale.ROOT);

        Matcher ph = PHONE.matcher(m);
        if (ph.find()) {
            p.buyerPhone = ph.group(1);
        }
        String forPrice = ph.reset().replaceAll(" ");

        Matcher addr = ADDRESS_AFTER.matcher(forPrice);
        if (addr.find()) {
            String a = ADDRESS_STOP.matcher(addr.group(1)).replaceAll("").replaceAll("[\\s,;.]+$", "").trim();
            if (a.length() >= 3) {
                p.deliveryAddress = a;
            }
        }

        p.offeredPrice = firstPrice(p.deliveryAddress != null ? forPrice.replace(p.deliveryAddress, " ") : forPrice);
        Matcher q = QTY.matcher(forPrice);
        if (q.find()) {
            String g = q.group(1) != null ? q.group(1) : q.group(2) != null ? q.group(2) : q.group(3);
            p.quantity = Integer.valueOf(g);
        }

        boolean pickup = has(lower, "pickup", "pick up", "pick-up", "collect", "i will come", "i'll come", "self pickup");
        boolean delivery = has(lower, "deliver", "delivery", "ship", "courier", "send it", "home delivery", "send to");
        if (pickup && !delivery) {
            p.deliveryMethod = "PICKUP";
        } else if (delivery && !pickup) {
            p.deliveryMethod = "DELIVERY";
        }

        p.paymentMethod = detectPayment(lower);

        boolean accept = has(lower, "deal", "agreed", "i accept", "ok i'll take", "okay i'll take", "i'll take it", "i will take it",
                "sounds good", "works for me", "fine with that", "ok done", "okay done", "that works", "ok fine", "okay fine", "go with that");
        boolean confirm = has(lower, "yes", "yep", "yeah", "confirm", "place the order", "place order", "go ahead", "proceed", "correct", "that's right", "sure");
        boolean buy = has(lower, "buy", "purchase", "order it", "want it", "i'll order", "i will order", "book it", "checkout");
        boolean discount = has(lower, "discount", "cheaper", "lower price", "reduce", "less price", "best price", "negotiat", "bargain",
                "can you do", "any offer", "bit less", "can't afford", "too expensive", "too costly", "too high", "last price");
        boolean decline = has(lower, "no thanks", "not interested", "cancel", "never mind", "nevermind", "forget it", "too much for me");
        boolean greeting = lower.matches("^(hi|hello|hey|hii+|good (morning|afternoon|evening)|namaste|vanakkam)\\b.*") && m.length() < 30;
        boolean info = has(lower, "?", "what", "which", "how", "when", "where", "do you", "is it", "are there", "tell me", "details", "warranty",
                "return", "stock", "available", "specification", "specs", "material", "size", "colour", "color", "payment", "cod");

        if (decline) {
            p.intent = "DECLINE";
        } else if (p.offeredPrice != null && !confirm) {
            p.intent = "NEGOTIATE_PRICE";
        } else if (accept) {
            p.intent = "ACCEPT_PRICE";
        } else if (discount) {
            p.intent = "ASK_DISCOUNT";
        } else if (confirm && !info) {
            p.intent = "CONFIRM_ORDER";
        } else if (buy) {
            p.intent = "BUY";
        } else if (p.buyerPhone != null || p.paymentMethod != null || p.deliveryMethod != null || p.quantity != null) {
            p.intent = info ? "ASK_INFO" : "PROVIDE_DETAILS";
        } else if (greeting) {
            p.intent = "GREETING";
        } else if (info) {
            p.intent = "ASK_INFO";
        }
        // A bare number such as "4500" in reply to a price is an offer.
        if ("OTHER".equals(p.intent) || p.offeredPrice == null) {
            Matcher b = BARE_NUMBER.matcher(forPrice);
            if (b.matches()) {
                p.offeredPrice = toNumber(b.group(1), b.group(2));
                p.intent = "NEGOTIATE_PRICE";
            }
        }
        return p;
    }

    public static Double firstPrice(String message) {
        for (Pattern pat : new Pattern[]{PRICE_SYMBOL, PRICE_SUFFIX, PRICE_WORD}) {
            Matcher m = pat.matcher(message);
            while (m.find()) {
                Double v = toNumber(m.group(1), m.group(2));
                if (v != null && v >= 1) {
                    return v;
                }
            }
        }
        return null;
    }

    private static Double toNumber(String digits, String k) {
        try {
            double v = Double.parseDouble(digits.replace(",", ""));
            return k != null ? v * 1000 : v;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String detectPayment(String lower) {
        if (has(lower, "upi", "gpay", "google pay", "phonepe", "paytm", "bhim")) return "UPI";
        if (has(lower, "cash on delivery", "cod", "cash")) return "Cash on Delivery";
        if (has(lower, "credit card", "debit card", "card")) return "Card";
        if (has(lower, "bank transfer", "neft", "imps", "rtgs", "net banking", "netbanking")) return "Bank Transfer";
        return null;
    }

    private static boolean has(String text, String... needles) {
        for (String n : needles) {
            if (n.equals("?") ? text.contains("?") : Pattern.compile("(?<![a-z])" + Pattern.quote(n)).matcher(text).find()) {
                return true;
            }
        }
        return false;
    }
}
