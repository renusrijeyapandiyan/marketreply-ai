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
