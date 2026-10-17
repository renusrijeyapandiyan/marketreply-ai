# What changed

## Fixed
- Backend did not compile: `SellerImageController` used `Seller.productImages` / `SellerDTO.MAX_PRODUCT_IMAGES`, which did not exist. Added.
- The public marketplace returned each seller's **minimum price** to every buyer. Buyers now get `ProductPublicDTO` (no floor, no max discount, no private notes).
- Orders always used the listed price, so a negotiated price was lost. Orders now use the server-side agreed price.
- Photos could exceed Mongo's 16 MB document limit (10 x 2 MB). Now 5 x 1.5 MB, resized in the browser.
- Font mismatch (index.html vs tailwind config).

## New
- Seller enters: selling price, max discount % (minimum acceptable price = price after that discount, auto-calculated and private), negotiation style, stock, delivery (charge, free-above, days, locations, pickup), payment methods, returns, warranty, private notes.
- AI shopping assistant (`/api/chat/*`): answers questions, negotiates, collects quantity / delivery / address / payment / phone, shows a summary, and places the order on confirmation.
- Safety: prices are decided by `NegotiationEngine` in code. Gemini only understands the wording and phrases the reply; it never sees the minimum price, and replies containing numbers not supplied by the server are discarded. If Gemini is down, rule-based fallbacks keep the chat working.
- `OrderService.placeOrder` re-checks stock, floor price, delivery area, payment method and phone for every order.
- Storefront browsing is public; chat/orders/selling need login.
- Seller hub: dashboard, products, orders (status updates), AI chat transcripts.

## Not verified here
Maven Central was unreachable, so the Spring app was not run. The new Java was compiled against stub libraries and the negotiation + chat flow was exercised end to end with in-memory repositories. Run `mvn spring-boot:run` once to confirm. The frontend builds with `npm run build`.

## Round 2
- Negotiation now behaves like a real shop: a too-low offer is simply declined at the quoted price (no number revealed, no hint of a minimum). Only when the buyer asks for a discount does the price step down; the last step is announced as the final price.
- Chat is a floating chat box (full screen on phones) with the seller/product in the header, quick-reply chips and an inline order summary. No analysis cards.
- Home page rebuilt as a marketplace: dark header with big search, hero, category tiles, "Deals you can negotiate" row, full product grid with sort / negotiable filter / show more, and a "Chat with seller" button on every card.
- Product photos show on cards, product page, hero, chat header and cart. Upload limit raised to 2 MB (Spring default was 1 MB).
- New coral / gold / charcoal theme.
- Backend reads the Mongo URI from MONGODB_URI (or SPRING_DATA_MONGODB_URI).

## Demo data
- `DemoDataSeeder` adds 6 demo sellers and 24 products (furniture, electronics, fashion, kitchen, books/toys, handmade) with prices, discounts, delivery areas, payment methods and generated product pictures.
- Off by default. Set `SEED_DEMO_DATA=true` on the backend to run it. It never duplicates. Demo seller logins: password `Demo@1234` (e.g. kovai.furniture@demo.marketreply.in).
