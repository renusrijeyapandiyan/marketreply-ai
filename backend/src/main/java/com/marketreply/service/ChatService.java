package com.marketreply.service;

import com.marketreply.dto.ChatSummaryDTO;
import com.marketreply.dto.ChatViewDTO;
import com.marketreply.dto.OrderDTO;
import com.marketreply.exception.InvalidRequestException;
import com.marketreply.exception.ResourceNotFoundException;
import com.marketreply.model.ChatMessage;
import com.marketreply.model.ChatSession;
import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;
import com.marketreply.model.User;
import com.marketreply.negotiation.CommerceRules;
import com.marketreply.negotiation.MessageParser;
import com.marketreply.negotiation.NegotiationEngine;
import com.marketreply.negotiation.NegotiationEngine.Decision;
import com.marketreply.negotiation.NegotiationEngine.Type;
import com.marketreply.repository.ChatSessionRepository;
import com.marketreply.repository.SellerRepository;
import com.marketreply.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The AI shopping assistant: negotiates the price, answers questions about delivery / payment /
 * locations, collects the order details and places the order once the buyer confirms.
 *
 * All decisions (prices, validation, order placement) are made here in plain code; the language
 * model only understands the buyer's wording and phrases the answer.
 */
@Service
public class ChatService {

    private static final int MAX_MESSAGE_LENGTH = 600;
    private static final int MAX_MESSAGES_PER_SESSION = 200;

    private final ChatSessionRepository sessionRepository;
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final ChatAssistantService assistant;

    public ChatService(ChatSessionRepository sessionRepository, SellerRepository sellerRepository,
                       UserRepository userRepository, OrderService orderService, ChatAssistantService assistant) {
        this.sessionRepository = sessionRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.assistant = assistant;
    }

    // ================================================================= public API

    /** Resumes the buyer's open chat about this product, or opens a new one with a greeting. */
    public ChatViewDTO start(String buyerId, String sellerId, boolean forceNew) {
        Seller seller = getSeller(sellerId);
        ChatSession session = forceNew ? null
                : sessionRepository.findFirstByBuyerIdAndSellerIdOrderByUpdatedAtDesc(buyerId, sellerId)
                .filter(s -> !ChatSession.STAGE_ORDERED.equals(s.getStage())).orElse(null);
        if (session == null) {
            session = new ChatSession();
            session.setSellerId(sellerId);
            session.setBuyerId(buyerId);
            session.getMessages().add(new ChatMessage("AI", greeting(seller)));
            session = sessionRepository.save(session);
        }
        return toView(session, seller, null, false);
    }

    public ChatViewDTO get(String userId, String sessionId) {
        ChatSession session = getSession(sessionId);
        Seller seller = getSeller(session.getSellerId());
        assertCanSee(userId, session, seller);
        return toView(session, seller, null, false);
    }

    public ChatViewDTO send(String buyerId, String sessionId, String message) {
        if (message == null || message.isBlank()) {
            throw new InvalidRequestException("Message cannot be empty");
        }
        String text = message.trim();
        if (text.length() > MAX_MESSAGE_LENGTH) {
            throw new InvalidRequestException("Message is too long (max " + MAX_MESSAGE_LENGTH + " characters)");
        }
        ChatSession session = getSession(sessionId);
        if (!buyerId.equals(session.getBuyerId())) {
            throw new ResourceNotFoundException("Chat not found: " + sessionId);
        }
        if (ChatSession.STAGE_ORDERED.equals(session.getStage())) {
            throw new InvalidRequestException("This order is already placed. Start a new chat to buy again.");
        }
        if (session.getMessages().size() >= MAX_MESSAGES_PER_SESSION) {
            throw new InvalidRequestException("This chat is full. Please start a new one.");
        }
        Seller seller = getSeller(session.getSellerId());
        session.getMessages().add(new ChatMessage("BUYER", text));
        return process(session, seller, text, false);
    }

    /** The "Confirm & place order" button: same as the buyer typing "yes". */
    public ChatViewDTO confirm(String buyerId, String sessionId) {
        ChatSession session = getSession(sessionId);
        if (!buyerId.equals(session.getBuyerId())) {
            throw new ResourceNotFoundException("Chat not found: " + sessionId);
        }
        if (!ChatSession.STAGE_CONFIRMING.equals(session.getStage())) {
            throw new InvalidRequestException("There is nothing to confirm yet. Finish the order details in the chat first.");
        }
        Seller seller = getSeller(session.getSellerId());
        session.getMessages().add(new ChatMessage("BUYER", "Yes, place the order"));
        return process(session, seller, "Yes, place the order", true);
    }

    /** Chats the user took part in as a buyer, or received on products they sell. */
    public List<ChatSummaryDTO> listFor(String userId) {
        List<ChatSession> sessions = new ArrayList<>(sessionRepository.findByBuyerIdOrderByUpdatedAtDesc(userId));
        Set<String> owned = new HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(userId)) {
            owned.add(s.getId());
        }
        if (!owned.isEmpty()) {
            for (ChatSession s : sessionRepository.findBySellerIdInOrderByUpdatedAtDesc(owned)) {
                if (sessions.stream().noneMatch(x -> x.getId().equals(s.getId()))) {
                    sessions.add(s);
                }
            }
        }
        sessions.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));
        return sessions.stream().map(this::toSummary).toList();
    }

    /** Chats about products this user sells. */
    public List<ChatSummaryDTO> listForSeller(String userId) {
        Set<String> owned = new HashSet<>();
        for (Seller s : sellerRepository.findByOwnerId(userId)) {
            owned.add(s.getId());
        }
        if (owned.isEmpty()) {
            return new ArrayList<>();
        }
        return sessionRepository.findBySellerIdInOrderByUpdatedAtDesc(owned).stream().map(this::toSummary).toList();
    }

    public ChatSummaryDTO toSummary(ChatSession s) {
        Seller seller = sellerRepository.findById(s.getSellerId()).orElse(null);
        ChatSummaryDTO dto = new ChatSummaryDTO();
        dto.setId(s.getId());
        dto.setSellerId(s.getSellerId());
        dto.setProductName(seller != null ? seller.getProductName() : "Removed product");
        dto.setListedPrice(seller != null ? seller.getListedPrice() : null);
        dto.setBuyerName(userRepository.findById(s.getBuyerId()).map(User::getName).orElse("Buyer"));
        List<ChatMessage> m = s.getMessages();
        dto.setLastMessage(m.isEmpty() ? "" : m.get(m.size() - 1).getText());
        dto.setMessageCount(m.size());
        dto.setStage(s.getStage());
        dto.setAgreedPrice(s.getAgreedPrice());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }

    // ================================================================= the conversation turn

    private ChatViewDTO process(ChatSession session, Seller seller, String text, boolean buttonConfirm) {
        SellerRule rules = seller.getRules() != null ? seller.getRules() : new SellerRule();
        boolean wasConfirming = ChatSession.STAGE_CONFIRMING.equals(session.getStage());

        ChatAssistantService.Understanding u = buttonConfirm ? null : assistant.understand(seller, session, text);
        MessageParser.Parsed p;
        if (buttonConfirm) {
            p = new MessageParser.Parsed();
            p.intent = "CONFIRM_ORDER";
        } else {
            p = u.parsed;
        }
        String intent = p.intent == null ? "OTHER" : p.intent;
        // We just asked for an address and the reply looks like one: take it even if no model understood it.
        if (!buttonConfirm && p.deliveryAddress == null && session.getAgreedPrice() != null
                && "DELIVERY".equals(session.getDeliveryMethod()) && session.getDeliveryAddress() == null
                && ("OTHER".equals(intent) || "PROVIDE_DETAILS".equals(intent) || "NEGOTIATE_PRICE".equals(intent) && p.offeredPrice != null && p.offeredPrice < 1000)
                && MessageParser.looksLikeAddress(text)) {
            p.deliveryAddress = text;
            p.offeredPrice = null;
            intent = "PROVIDE_DETAILS";
        }
        boolean aiFallback = !buttonConfirm && !u.usedAi;

        List<String> notices = new ArrayList<>();
        boolean draftChanged = false;
        boolean detailIntent = !intent.equals("ASK_INFO") && !intent.equals("GREETING")
                && !intent.equals("DECLINE") && !intent.equals("OTHER");

        // ---- 1. capture order details, validating each against the seller's rules ----
        if (detailIntent) {
            draftChanged = captureDetails(session, seller, rules, p, notices);
        }

        // ---- 2. price decision (server side) ----
        Decision decision = null;
        boolean reopened = false;
        switch (intent) {
            case "NEGOTIATE_PRICE" -> {
                decision = NegotiationEngine.decideOnOffer(seller, session, p.offeredPrice);
                reopened = true;
            }
            case "ASK_DISCOUNT" -> {
                decision = NegotiationEngine.decideOnOffer(seller, session, null);
                reopened = true;
            }
            case "ACCEPT_PRICE" -> decision = NegotiationEngine.decideOnAcceptance(seller, session);
            case "BUY", "CONFIRM_ORDER" -> {
                if (session.getAgreedPrice() == null) {
                    decision = NegotiationEngine.decideOnAcceptance(seller, session);
                }
            }
            default -> { }
        }
        if (decision != null) {
            if (reopened && session.getAgreedPrice() != null && decision.type != Type.ACCEPT) {
                session.setAgreedPrice(null);
            }
            NegotiationEngine.apply(session, decision, decision.type == Type.COUNTER);
            if (decision.type == Type.ACCEPT && session.getQuantity() == null) {
                session.setQuantity(1);
            }
            if (reopened) {
                draftChanged = true;
            }
        }

        // ---- 3. what is still missing? ----
        List<String> missing = missingFields(session, rules);

        // ---- 4. place the order, or ask for confirmation ----
        OrderDTO placed = null;
        boolean readyToPlace = session.getAgreedPrice() != null && missing.isEmpty();
        boolean confirmedNow = "CONFIRM_ORDER".equals(intent) && wasConfirming && !draftChanged;

        if (readyToPlace && confirmedNow) {
            try {
                placed = orderService.placeOrder(session.getBuyerId(), seller, session.getQuantity(),
                        session.getAgreedPrice(), session.getDeliveryMethod(), session.getDeliveryAddress(),
                        session.getPaymentMethod(), session.getBuyerPhone(), session.getId(), "Placed via AI assistant");
                session.setStage(ChatSession.STAGE_ORDERED);
                session.setOrderId(placed.getId());
            } catch (InvalidRequestException e) {
                notices.add("The order could not be placed: " + e.getMessage());
                session.setStage(ChatSession.STAGE_CHATTING);
                readyToPlace = false;
            }
        } else if (readyToPlace) {
            session.setStage(ChatSession.STAGE_CONFIRMING);
        } else {
            session.setStage(ChatSession.STAGE_CHATTING);
        }
        if (placed == null && "DECLINE".equals(intent)) {
            session.setStage(ChatSession.STAGE_CHATTING);
        }

        // ---- 5. write the reply ----
        String reply;
        if (placed != null) {
            reply = orderPlacedReply(seller, placed);
        } else {
            String facts = buildFacts(seller, session, decision, notices, missing, readyToPlace);
            reply = assistant.phrase(seller, session, facts, text);
            if (reply == null) {
                aiFallback = true;
                reply = templateReply(seller, session, intent, decision, notices, missing, readyToPlace);
            }
        }
        session.getMessages().add(new ChatMessage("AI", reply));
        session.setUpdatedAt(Instant.now());
        session = sessionRepository.save(session);
        return toView(session, seller, placed, aiFallback);
    }

    /** Returns true if any order field changed. Invalid choices become notices, never silent errors. */
    private boolean captureDetails(ChatSession s, Seller seller, SellerRule rules, MessageParser.Parsed p, List<String> notices) {
        boolean changed = false;
        boolean canDeliver = Boolean.TRUE.equals(rules.getDeliveryAvailable());
        boolean canPickup = Boolean.TRUE.equals(rules.getPickupAvailable());

        if (p.quantity != null && p.quantity >= 1 && !p.quantity.equals(s.getQuantity())) {
            if (!CommerceRules.inStock(seller, p.quantity)) {
                notices.add("Only " + seller.getStock() + " unit(s) are in stock, so " + p.quantity + " is not possible.");
            } else {
                s.setQuantity(p.quantity);
                changed = true;
            }
        }

        String method = p.deliveryMethod;
        if (method == null && p.deliveryAddress != null && canDeliver) {
            method = "DELIVERY";
        }
        if (method != null && !method.equals(s.getDeliveryMethod())) {
            if ("DELIVERY".equals(method) && !canDeliver) {
                notices.add("This seller does not offer delivery" + (canPickup ? ", but pickup is available." : "."));
            } else if ("PICKUP".equals(method) && !canPickup) {
                notices.add("Pickup is not available for this product" + (canDeliver ? ", but delivery is." : "."));
            } else {
                s.setDeliveryMethod(method);
                changed = true;
            }
        }

        if (p.deliveryAddress != null && !p.deliveryAddress.isBlank() && !p.deliveryAddress.equals(s.getDeliveryAddress())) {
            if (!canDeliver) {
                // already explained above
            } else if (!CommerceRules.servesLocation(rules, p.deliveryAddress)) {
                notices.add("The seller cannot deliver to \"" + p.deliveryAddress + "\". They deliver to: "
                        + String.join(", ", rules.getDeliveryLocations()) + ".");
            } else {
                s.setDeliveryAddress(p.deliveryAddress.trim());
                changed = true;
            }
        }

        if (p.paymentMethod != null && !p.paymentMethod.isBlank()) {
            String match = CommerceRules.matchAcceptedPayment(rules, p.paymentMethod);
            if (match == null) {
                notices.add("The seller does not accept " + p.paymentMethod + ". Accepted: "
                        + String.join(", ", rules.getAcceptedPaymentMethods()) + ".");
            } else if (!match.equals(s.getPaymentMethod())) {
                s.setPaymentMethod(match);
                changed = true;
            }
        }

        if (p.buyerPhone != null) {
            String digits = p.buyerPhone.replaceAll("[^0-9]", "");
            if (digits.length() >= 10 && !digits.equals(s.getBuyerPhone())) {
                s.setBuyerPhone(digits.length() > 10 ? digits.substring(digits.length() - 10) : digits);
                changed = true;
            }
        }
        return changed;
    }

    /** Fields the order still needs, in the order the assistant asks for them. Empty until a price is agreed. */
    private List<String> missingFields(ChatSession s, SellerRule rules) {
        List<String> missing = new ArrayList<>();
        if (s.getAgreedPrice() == null) {
            return missing;
        }
        boolean canDeliver = Boolean.TRUE.equals(rules.getDeliveryAvailable());
        boolean canPickup = Boolean.TRUE.equals(rules.getPickupAvailable());
        if (s.getQuantity() == null) {
            s.setQuantity(1);
        }
        if (s.getDeliveryMethod() == null) {
            if (canDeliver && !canPickup) s.setDeliveryMethod("DELIVERY");
            else if (canPickup && !canDeliver) s.setDeliveryMethod("PICKUP");
            else missing.add("deliveryMethod");
        }
        if ("DELIVERY".equals(s.getDeliveryMethod()) && (s.getDeliveryAddress() == null || s.getDeliveryAddress().isBlank())) {
            missing.add("deliveryAddress");
        }
        if (s.getPaymentMethod() == null) {
            missing.add("paymentMethod");
        }
        if (s.getBuyerPhone() == null) {
            missing.add("buyerPhone");
        }
        return missing;
    }

    // ================================================================= wording

    private String greeting(Seller seller) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        boolean negotiable = r.getMinPrice() != null && seller.getListedPrice() != null && r.getMinPrice() < seller.getListedPrice();
        return "Hi! I'm the shopping assistant for " + seller.getName() + ". The " + seller.getProductName()
                + " is listed at " + CommerceRules.money(seller.getListedPrice() == null ? 0 : seller.getListedPrice())
                + ". " + (negotiable ? "Feel free to make an offer, " : "")
                + "I can also tell you about delivery, payment and anything else, and I can place your order right here.";
    }

    private String buildFacts(Seller seller, ChatSession s, Decision d, List<String> notices, List<String> missing, boolean ready) {
        StringBuilder sb = new StringBuilder(ChatAssistantService.productFacts(seller));
        sb.append("\nSTATE\n");
        if (s.getQuantity() != null) sb.append("Quantity: ").append(s.getQuantity()).append("\n");
        if (s.getAgreedPrice() != null) sb.append("Agreed price per unit: ").append(CommerceRules.money(s.getAgreedPrice())).append("\n");
        if (s.getDeliveryMethod() != null) sb.append("Chosen delivery method: ").append(s.getDeliveryMethod()).append("\n");
        if (s.getDeliveryAddress() != null) sb.append("Delivery address: ").append(s.getDeliveryAddress()).append("\n");
        if (s.getPaymentMethod() != null) sb.append("Chosen payment: ").append(s.getPaymentMethod()).append("\n");
        if (s.getBuyerPhone() != null) sb.append("Phone: ").append(s.getBuyerPhone()).append("\n");
        if (s.getAgreedPrice() != null && s.getQuantity() != null) {
            sb.append(summaryLine(seller, s)).append("\n");
        }
        sb.append("\nPRICE DECISION\n");
        if (d == null) {
            sb.append("No price decision this turn. Do not offer any new price or discount.");
            if (s.getLastCounter() != null && s.getAgreedPrice() == null) {
                sb.append(" The price currently on the table is ").append(CommerceRules.money(s.getLastCounter())).append(" per unit.");
            }
            sb.append("\n");
        } else if (d.type == Type.ACCEPT) {
            sb.append("ACCEPTED: the deal is ").append(CommerceRules.money(d.price)).append(" per unit. Confirm warmly.\n");
        } else if (d.type == Type.HOLD) {
            sb.append("HOLD: the seller does not give discounts on this product. The price stays ")
                    .append(CommerceRules.money(d.price)).append(". Say so politely and highlight value.\n");
        } else if (d.finalPrice) {
            sb.append("COUNTER (FINAL): offer ").append(CommerceRules.money(d.price))
                    .append(" per unit and say this is the best and final price.\n");
        } else {
            sb.append("COUNTER: the buyer's offer is too low. Politely offer ").append(CommerceRules.money(d.price))
                    .append(" per unit instead. Do not say it is final.\n");
        }
        sb.append("\nNOTICES\n");
        if (notices.isEmpty()) sb.append("none\n");
        for (String n : notices) sb.append("- ").append(n).append("\n");
        sb.append("\nNEXT STEP\n").append(nextStepText(seller, missing, ready, s)).append("\n");
        return sb.toString();
    }

    private String summaryLine(Seller seller, ChatSession s) {
        SellerRule rules = seller.getRules();
        double subtotal = s.getAgreedPrice() * s.getQuantity();
        double fee = CommerceRules.deliveryFee(rules, s.getDeliveryMethod(), subtotal);
        return "Order summary: " + s.getQuantity() + " x " + CommerceRules.money(s.getAgreedPrice())
                + " = " + CommerceRules.money(subtotal)
                + (fee > 0 ? " + delivery " + CommerceRules.money(fee) : "")
                + " | Total: " + CommerceRules.money(subtotal + fee);
    }

    private String nextStepText(Seller seller, List<String> missing, boolean ready, ChatSession s) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        if (ready) {
            return "Show the order summary from STATE and ask the shopper to confirm so you can place the order (they can reply yes).";
        }
        if (!missing.isEmpty()) {
            switch (missing.get(0)) {
                case "deliveryMethod": return "Ask whether they want home delivery or pickup.";
                case "deliveryAddress": return "Ask for the delivery address including city / pincode.";
                case "paymentMethod": return "Ask how they would like to pay. Options: "
                        + (r.getAcceptedPaymentMethods() == null || r.getAcceptedPaymentMethods().isEmpty() ? "any" : String.join(", ", r.getAcceptedPaymentMethods())) + ".";
                case "buyerPhone": return "Ask for a contact phone number for the delivery / seller.";
                default: break;
            }
        }
        return "Ask if they have any other questions or want to make an offer or place an order.";
    }

    /** Used when the model is unavailable or produced something unsafe. Plain, correct, a little stiff. */
    private String templateReply(Seller seller, ChatSession s, String intent, Decision d, List<String> notices,
                                 List<String> missing, boolean ready) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        List<String> parts = new ArrayList<>();
        if ("GREETING".equals(intent)) {
            parts.add(greeting(seller));
        }
        if (d != null) {
            switch (d.type) {
                case ACCEPT -> parts.add("Deal! " + CommerceRules.money(d.price) + " per unit works for me.");
                case HOLD -> parts.add("The price for this product is fixed at " + CommerceRules.money(d.price) + ", I'm afraid I can't offer a discount.");
                case COUNTER -> parts.add(d.finalPrice
                        ? "The best I can do is " + CommerceRules.money(d.price) + " per unit, and that's my final price."
                        : "That's a bit low for me, but I can do " + CommerceRules.money(d.price) + " per unit.");
                default -> { }
            }
        } else if ("DECLINE".equals(intent)) {
            parts.add("No problem at all. If you change your mind, I'm here.");
        } else if ("ASK_INFO".equals(intent)) {
            parts.add(infoSummary(seller));
        }
        parts.addAll(notices);
        if (ready) {
            parts.add(summaryLine(seller, s).replace("Order summary: ", "Your order: ") + ". Shall I place it? Reply yes to confirm.");
        } else if (!missing.isEmpty()) {
            switch (missing.get(0)) {
                case "deliveryMethod": parts.add("Would you like home delivery or pickup?"); break;
                case "deliveryAddress": parts.add("Please share your delivery address with city and pincode."); break;
                case "paymentMethod": parts.add("How would you like to pay? We accept " + (r.getAcceptedPaymentMethods() == null || r.getAcceptedPaymentMethods().isEmpty() ? "any method" : String.join(", ", r.getAcceptedPaymentMethods())) + "."); break;
                case "buyerPhone": parts.add("What phone number can the seller reach you on?"); break;
                default: break;
            }
        } else if (parts.isEmpty() || (d == null && !"ASK_INFO".equals(intent) && !"DECLINE".equals(intent))) {
            parts.add("I can help with the price, delivery, payment or placing your order. What would you like to do?");
        }
        return String.join(" ", parts);
    }

    private String infoSummary(Seller seller) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        List<String> bits = new ArrayList<>();
        bits.add(seller.getProductName() + " is " + CommerceRules.money(seller.getListedPrice() == null ? 0 : seller.getListedPrice()) + ".");
        if (Boolean.TRUE.equals(r.getDeliveryAvailable())) {
            String where = r.getDeliveryLocations() == null || r.getDeliveryLocations().isEmpty() ? "" : " to " + String.join(", ", r.getDeliveryLocations());
            String days = r.getEstimatedDeliveryDays() == null ? "" : " in about " + r.getEstimatedDeliveryDays() + " day(s)";
            bits.add("Delivery is available" + where + days + ".");
        }
        if (Boolean.TRUE.equals(r.getPickupAvailable())) bits.add("Pickup is available.");
        if (r.getAcceptedPaymentMethods() != null && !r.getAcceptedPaymentMethods().isEmpty()) {
            bits.add("Payment: " + String.join(", ", r.getAcceptedPaymentMethods()) + ".");
        }
        return String.join(" ", bits);
    }

    private String orderPlacedReply(Seller seller, OrderDTO o) {
        StringBuilder sb = new StringBuilder();
        sb.append("Your order is placed! ").append(o.getQuantity()).append(" x ").append(o.getProductName())
                .append(", total ").append(CommerceRules.money(o.getTotalPrice())).append(" (")
                .append(o.getPaymentMethod()).append("). ");
        if ("PICKUP".equals(o.getDeliveryMethod())) {
            sb.append("You can collect it from the seller.");
        } else {
            SellerRule r = seller.getRules();
            sb.append("It will be delivered to ").append(o.getDeliveryAddress());
            if (r != null && r.getEstimatedDeliveryDays() != null) sb.append(" in about ").append(r.getEstimatedDeliveryDays()).append(" day(s)");
            sb.append(".");
        }
        sb.append(" You can track it under My Orders. Thank you!");
        return sb.toString();
    }

    // ================================================================= view

    private ChatViewDTO toView(ChatSession s, Seller seller, OrderDTO order, boolean aiFallback) {
        SellerRule rules = seller.getRules() != null ? seller.getRules() : new SellerRule();
        ChatViewDTO v = new ChatViewDTO();
        v.setSessionId(s.getId());
        v.setSellerId(s.getSellerId());
        v.setStage(s.getStage());
        v.setMessages(s.getMessages());
        v.setListedPrice(seller.getListedPrice());
        v.setCurrentOffer(s.getLastCounter());
        v.setAgreedPrice(s.getAgreedPrice());
        v.setFinalPrice(s.isFinalPrice());
        v.setQuantity(s.getQuantity());
        v.setDeliveryMethod(s.getDeliveryMethod());
        v.setDeliveryAddress(s.getDeliveryAddress());
        v.setPaymentMethod(s.getPaymentMethod());
        v.setBuyerPhone(s.getBuyerPhone());
        v.setAiFallback(aiFallback);

        List<String> missing = s.getAgreedPrice() != null && !ChatSession.STAGE_ORDERED.equals(s.getStage())
                ? missingFields(s, rules) : new ArrayList<>();
        v.setMissing(missing);

        if (s.getAgreedPrice() != null && s.getQuantity() != null) {
            double subtotal = s.getAgreedPrice() * s.getQuantity();
            double fee = CommerceRules.deliveryFee(rules, s.getDeliveryMethod(), subtotal);
            v.setUnitPrice(s.getAgreedPrice());
            v.setSubtotal(subtotal);
            v.setDeliveryCharge(fee);
            v.setTotal(subtotal + fee);
        }
        if (order == null && s.getOrderId() != null) {
            try {
                order = orderService.getOrderForViewer(s.getBuyerId(), s.getOrderId());
            } catch (RuntimeException ignored) {
                // order may have been removed; the chat still renders
            }
        }
        v.setOrder(order);
        v.setQuickReplies(quickReplies(seller, s, missing));
        return v;
    }

    private List<String> quickReplies(Seller seller, ChatSession s, List<String> missing) {
        SellerRule r = seller.getRules() != null ? seller.getRules() : new SellerRule();
        List<String> q = new ArrayList<>();
        String stage = s.getStage();
        if (ChatSession.STAGE_ORDERED.equals(stage)) {
            return q;
        }
        if (ChatSession.STAGE_CONFIRMING.equals(stage)) {
            q.add("Yes, place the order");
            q.add("I want to change something");
            return q;
        }
        if (s.getAgreedPrice() != null && !missing.isEmpty()) {
            switch (missing.get(0)) {
                case "deliveryMethod" -> { q.add("Home delivery"); q.add("Self pickup"); }
                case "paymentMethod" -> {
                    if (r.getAcceptedPaymentMethods() != null) {
                        for (String m : r.getAcceptedPaymentMethods()) { if (q.size() < 4) q.add("Pay by " + m); }
                    }
                }
                default -> { }
            }
            return q;
        }
        if (s.getLastCounter() != null) {
            q.add("Deal, I'll take it at " + CommerceRules.money(s.getLastCounter()));
            if (!s.isFinalPrice()) q.add("Can you do a little less?");
            q.add("No thanks");
            return q;
        }
        boolean negotiable = r.getMinPrice() != null && seller.getListedPrice() != null && r.getMinPrice() < seller.getListedPrice();
        if (negotiable) q.add("Can I get a discount?");
        q.add("What are the delivery options?");
        q.add("Which payment methods do you accept?");
        q.add("I'll buy it");
        return q;
    }

    // ================================================================= lookups

    private Seller getSeller(String id) {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private ChatSession getSession(String id) {
        if (id == null || id.isBlank()) {
            throw new InvalidRequestException("sessionId is required");
        }
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found: " + id));
    }

    private void assertCanSee(String userId, ChatSession s, Seller seller) {
        if (!userId.equals(s.getBuyerId()) && !userId.equals(seller.getOwnerId())) {
            throw new ResourceNotFoundException("Chat not found: " + s.getId());
        }
    }
}
