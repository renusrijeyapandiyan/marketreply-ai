package com.marketreply.seed;

import com.marketreply.model.Seller;
import com.marketreply.model.SellerRule;
import com.marketreply.model.User;
import com.marketreply.repository.SellerRepository;
import com.marketreply.repository.UserRepository;
import com.marketreply.service.SellerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Adds sample sellers and products so the marketplace looks alive.
 *
 * Off by default. Turn it on with the environment variable SEED_DEMO_DATA=true.
 * It is idempotent: a product that already exists for a demo seller is skipped, so restarting the
 * app never creates duplicates. Every demo seller can log in with the password {@value #DEMO_PASSWORD}.
 * Photos are generated illustrations (SVG), which sellers can replace from Seller Hub.
 */
@Component
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    public static final String DEMO_PASSWORD = "Demo@1234";
    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DemoDataSeeder(UserRepository userRepository, SellerRepository sellerRepository) {
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
    }

    /** Shop-level settings shared by all of one seller's products. */
    private record Shop(String name, String email, List<String> cities, String pickup, double charge, double freeAbove,
                        int days, List<String> payments, String style, String returns) {
    }

    private record Item(String name, String description, String category, double price, int stock, double discount,
                        String emoji, String from, String to, String warranty) {
    }

    @Override
    public void run(String... args) {
        int created = 0;
        for (int i = 0; i < SHOPS.size(); i++) {
            Shop shop = SHOPS.get(i);
            User owner = userRepository.findByEmail(shop.email()).orElseGet(() -> {
                User u = new User();
                u.setName(shop.name());
                u.setEmail(shop.email());
                u.setPasswordHash(encoder.encode(DEMO_PASSWORD));
                return userRepository.save(u);
            });
            List<String> existing = new ArrayList<>();
            for (Seller s : sellerRepository.findByOwnerId(owner.getId())) {
                existing.add(s.getProductName());
            }
            for (Item item : CATALOG.get(i)) {
                if (existing.contains(item.name())) {
                    continue;
                }
                sellerRepository.save(build(owner, shop, item));
                created++;
            }
        }
        log.info("Demo data: {} new product(s) added. Demo seller password: {}", created, DEMO_PASSWORD);
    }

    private Seller build(User owner, Shop shop, Item item) {
        Seller s = new Seller();
        s.setOwnerId(owner.getId());
        s.setName(shop.name());
        s.setEmail(shop.email());
        s.setProductName(item.name());
        s.setProductDescription(item.description());
        s.setCategory(item.category());
        s.setListedPrice(item.price());
        s.setStock(item.stock());
        s.setProductImages(new ArrayList<>(List.of(
                art(item.emoji(), item.from(), item.to(), item.name(), false),
                art(item.emoji(), item.to(), item.from(), item.name(), true))));

        SellerRule r = new SellerRule();
        r.setMaxDiscountPercent(item.discount());
        r.setNegotiationStyle(shop.style());
        r.setDeliveryAvailable(true);
        r.setPickupAvailable(shop.pickup() != null);
        r.setPickupAddress(shop.pickup());
        r.setDeliveryCharge(shop.charge());
        r.setFreeDeliveryAbove(shop.freeAbove() > 0 ? shop.freeAbove() : null);
        r.setEstimatedDeliveryDays(shop.days());
        r.setDeliveryLocations(new ArrayList<>(shop.cities()));
        r.setAcceptedPaymentMethods(new ArrayList<>(shop.payments()));
        r.setReturnPolicy(shop.returns());
        r.setWarranty(item.warranty());
        s.setRules(r);
        s.setCreatedAt(Instant.now());
        s.setUpdatedAt(Instant.now());
        SellerService.normalize(s); // computes the minimum acceptable price from the discount
        return s;
    }

    /** A bright illustrated product picture as a data URI (no external files needed). */
    static String art(String emoji, String from, String to, String label, boolean pattern) {
        StringBuilder svg = new StringBuilder();
        svg.append("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>")
                .append("<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='").append(from)
                .append("'/><stop offset='1' stop-color='").append(to).append("'/></linearGradient></defs>")
                .append("<rect width='800' height='800' fill='url(#g)'/>")
                .append("<circle cx='650' cy='140' r='190' fill='white' opacity='.14'/>")
                .append("<circle cx='90' cy='720' r='230' fill='white' opacity='.10'/>");
        if (pattern) {
            for (int row = 0; row < 3; row++) {
                for (int col = 0; col < 3; col++) {
                    svg.append("<text x='").append(160 + col * 240).append("' y='").append(300 + row * 200)
                            .append("' font-size='130' text-anchor='middle' opacity='.55'>").append(emoji).append("</text>");
                }
            }
        } else {
            svg.append("<text x='400' y='470' font-size='340' text-anchor='middle'>").append(emoji).append("</text>");
        }
        String safe = label.replace("&", "and").replace("<", "").replace(">", "");
        if (safe.length() > 30) {
            safe = safe.substring(0, 29) + "\u2026";
        }
        svg.append("<rect x='100' y='640' width='600' height='84' rx='42' fill='black' opacity='.28'/>")
                .append("<text x='400' y='697' font-size='38' font-weight='700' text-anchor='middle' fill='white' font-family='Arial, sans-serif'>")
                .append(safe).append("</text></svg>");
        return "data:image/svg+xml;base64," + Base64.getEncoder().encodeToString(svg.toString().getBytes(StandardCharsets.UTF_8));
    }

    private static final List<String> UPI_COD = List.of("UPI", "Cash on Delivery");
    private static final List<String> ALL_PAY = List.of("UPI", "Cash on Delivery", "Card");

    private static final List<Shop> SHOPS = List.of(
            new Shop("Kovai Furniture House", "kovai.furniture@demo.marketreply.in",
                    List.of("Coimbatore", "Tiruppur", "Erode", "Salem", "Pollachi"), "12 Avinashi Road, Coimbatore",
                    500, 15000, 4, ALL_PAY, "MODERATE", "7-day replacement for transit damage"),
            new Shop("Madurai Gadget Hub", "madurai.gadgets@demo.marketreply.in",
                    List.of("Madurai", "Trichy", "Dindigul", "Theni", "Coimbatore"), null,
                    0, 0, 3, List.of("UPI", "Card"), "FIRM", "7-day replacement if defective, sealed box only"),
            new Shop("Chennai Fashion Studio", "chennai.fashion@demo.marketreply.in",
                    List.of("Chennai", "Kanchipuram", "Chengalpattu", "Vellore", "Pondicherry"), "45 T Nagar Main Road, Chennai",
                    80, 1500, 3, ALL_PAY, "FLEXIBLE", "Easy 10-day size exchange"),
            new Shop("Salem Home & Kitchen", "salem.home@demo.marketreply.in",
                    List.of("Salem", "Namakkal", "Erode", "Coimbatore", "Karur"), null,
                    150, 3000, 5, UPI_COD, "MODERATE", "Replacement within 7 days for manufacturing defects"),
            new Shop("Nellai Books & Toys", "nellai.books@demo.marketreply.in",
                    List.of("Tirunelveli", "Madurai", "Thoothukudi", "Nagercoil"), "8 Junction Road, Tirunelveli",
                    60, 1000, 4, UPI_COD, "FLEXIBLE", "No returns on books; toys can be exchanged within 7 days"),
            new Shop("Trichy Handmade Crafts", "trichy.crafts@demo.marketreply.in",
                    List.of("Trichy", "Thanjavur", "Pudukkottai", "Karur", "Madurai"), "Big Bazaar Street, Trichy",
                    100, 2500, 6, List.of("UPI", "Cash on Delivery", "Bank Transfer"), "MODERATE", "Handmade items: exchange only for damage in transit"));

    private static final List<List<Item>> CATALOG = List.of(
            List.of(
                    new Item("Teak Study Table with Drawers", "Solid teak study table with two lockable drawers and a smooth polished top. 120 cm wide, ideal for home office or students.", "Furniture", 8500, 6, 12, "\uD83E\uDE91", "#b45309", "#f59e0b", "1 year against manufacturing defects"),
                    new Item("Ergonomic Office Chair", "Breathable mesh back, adjustable lumbar support, height and tilt control, smooth-rolling wheels. Comfortable for 8-hour workdays.", "Furniture", 6200, 12, 10, "\uD83D\uDCBA", "#1e293b", "#475569", "2 years on frame and gas lift"),
                    new Item("3-Seater Fabric Sofa", "Soft-touch fabric sofa on a hardwood frame with high-density foam cushions. Removable covers for easy washing.", "Furniture", 24900, 3, 15, "\uD83D\uDECB\uFE0F", "#7c3aed", "#c084fc", "3 years on frame"),
                    new Item("Wooden Bookshelf, 5 Shelves", "Sturdy engineered-wood bookshelf with five spacious shelves. Easy assembly, tool kit included. Walnut finish.", "Furniture", 4800, 9, 8, "\uD83D\uDCDA", "#92400e", "#d97706", "1 year warranty")),
            List.of(
                    new Item("Bluetooth Neckband Earphones", "Bluetooth 5.3 neckband with 30-hour battery, fast charging, deep bass and a noise-cancelling mic. Sweat and splash resistant.", "Electronics", 1299, 40, 15, "\uD83C\uDFA7", "#0f172a", "#2563eb", "1 year brand warranty"),
                    new Item("10000mAh Power Bank", "Slim 10000mAh power bank with 22.5W fast charging, dual USB-A and USB-C ports and LED battery indicator.", "Electronics", 1199, 55, 10, "\uD83D\uDD0B", "#065f46", "#10b981", "6 months warranty"),
                    new Item("AMOLED Smartwatch", "1.43-inch AMOLED smartwatch with heart-rate and SpO2 tracking, 100+ sports modes, calls from the wrist and a 7-day battery.", "Electronics", 3499, 18, 18, "\u231A", "#111827", "#6366f1", "1 year warranty"),
                    new Item("4K Action Camera", "4K/30fps action camera with image stabilisation, waterproof case up to 30 m, Wi-Fi and a mounting kit for bike and helmet.", "Electronics", 5999, 7, 12, "\uD83D\uDCF7", "#b91c1c", "#f97316", "1 year warranty")),
            List.of(
                    new Item("Handloom Cotton Saree", "Soft handloom cotton saree with a zari border and a matching blouse piece. Light, breathable and perfect for festive days.", "Fashion", 2450, 14, 15, "\uD83D\uDC57", "#be185d", "#f472b6", "Colour fastness guaranteed"),
                    new Item("Men's Slim-Fit Formal Shirt", "Wrinkle-resistant cotton-blend formal shirt in a slim fit. Available in sizes S to XXL, ask in chat for colours.", "Fashion", 899, 60, 10, "\uD83D\uDC54", "#1d4ed8", "#60a5fa", "Stitching warranty 30 days"),
                    new Item("Genuine Leather Wallet", "Handcrafted genuine leather wallet with 8 card slots, coin pocket and RFID protection. Gift box included.", "Fashion", 649, 35, 8, "\uD83D\uDC5B", "#78350f", "#b45309", "6 months warranty"),
                    new Item("Canvas Sneakers", "Lightweight canvas sneakers with a cushioned insole and a non-slip rubber sole. Everyday comfort in UK sizes 6 to 11.", "Fashion", 1499, 25, 20, "\uD83D\uDC5F", "#0f766e", "#2dd4bf", "3 months sole warranty")),
            List.of(
                    new Item("Stainless Steel Pressure Cooker, 5L", "Induction-friendly 5-litre stainless steel pressure cooker with a safety valve and a long-life gasket. Cooks faster and saves gas.", "Home & Kitchen", 1850, 20, 10, "\uD83C\uDF72", "#475569", "#94a3b8", "5 years on body"),
                    new Item("Non-stick Cookware Set, 3 pcs", "Kadai, frying pan and tawa with a scratch-resistant non-stick coating and cool-touch handles. Gas and induction compatible.", "Home & Kitchen", 2299, 15, 15, "\uD83C\uDF73", "#b91c1c", "#fb7185", "1 year warranty"),
                    new Item("Cotton King Bedsheet Set", "100% cotton king-size bedsheet with two pillow covers. 180 thread count, soft, colour-fast and easy to iron.", "Home & Kitchen", 1199, 30, 12, "\uD83D\uDECF\uFE0F", "#4338ca", "#a5b4fc", "Colour fastness guaranteed"),
                    new Item("Mixer Grinder, 750W", "750W mixer grinder with three stainless steel jars, overload protection and a powerful copper motor. Great for chutney and batter.", "Home & Kitchen", 3299, 10, 10, "\uD83C\uDF79", "#c2410c", "#fdba74", "2 years on motor")),
            List.of(
                    new Item("Tamil Classics Collection, 5 Books", "A boxed set of five Tamil literary classics in clean, readable print with a hardcover finish. A lovely gift for readers.", "Books", 1250, 22, 10, "\uD83D\uDCDA", "#7f1d1d", "#ef4444", "Replacement if pages are damaged"),
                    new Item("Wooden Educational Puzzle Set", "Child-safe wooden puzzles for ages 3 to 7 with letters, numbers and animals. Smooth edges and non-toxic paint.", "Toys & Kids", 749, 28, 10, "\uD83E\uDDE9", "#0369a1", "#38bdf8", "30-day exchange"),
                    new Item("Kids Cycle, 16 inch", "16-inch kids bicycle with training wheels, a chain guard and a comfortable padded seat. Recommended for ages 4 to 7.", "Toys & Kids", 5499, 5, 12, "\uD83D\uDEB2", "#be123c", "#fb923c", "1 year on frame"),
                    new Item("Anti-slip Yoga Mat, 6mm", "6mm thick, extra-grip yoga mat with a carry strap. Soft cushioning for yoga, stretching and floor workouts.", "Sports & Fitness", 599, 45, 8, "\uD83E\uDDD8", "#6d28d9", "#a78bfa", "3 months warranty")),
            List.of(
                    new Item("Thanjavur Painting, Framed", "Traditional Thanjavur painting with gold foil work and semi-precious stones, framed in teak. A handmade piece that lasts for generations.", "Handmade", 7500, 3, 10, "\uD83D\uDDBC\uFE0F", "#92400e", "#fbbf24", "Certificate of authenticity"),
                    new Item("Handmade Bamboo Basket Set", "Set of three woven bamboo baskets for storage and gifting. Natural finish, sturdy and eco-friendly.", "Handmade", 899, 18, 10, "\uD83E\uDDFA", "#4d7c0f", "#a3e635", "Handmade, minor variations are normal"),
                    new Item("Neem & Turmeric Soap, Pack of 4", "Cold-process herbal soap made with neem, turmeric and coconut oil. No harsh chemicals, gentle on skin.", "Beauty", 349, 80, 5, "\uD83E\uDDFC", "#15803d", "#86efac", "Skin-safe guarantee, return if unopened"),
                    new Item("Cold-pressed Coconut Oil, 1L", "Pure cold-pressed coconut oil, filtered and chemical-free. Great for cooking, hair care and skin.", "Groceries", 420, 60, 5, "\uD83E\uDD65", "#a16207", "#fde047", "Fresh stock, best before 6 months")));
}
