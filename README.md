# MarketReply AI

An AI-powered assistant that helps marketplace sellers respond to buyer messages.
The buyer's message and the seller's rules (minimum price, delivery, pickup, payment
methods, etc.) are sent to **Google Gemini (2.5 Flash)**, which returns the buyer's
intent, extracted details, a rule-compliance check, and a ready-to-send reply.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Spring Boot (Java 17)
- **Database:** MongoDB Atlas
- **AI:** Google Gemini 2.5 Flash (via the Generative Language REST API, called
  from `GeminiService` using Spring's `WebClient` — this avoids depending on a
  fast-moving Spring AI starter artifact so the project builds reliably out of
  the box)

---

## 1. Prerequisites

- Java 17+
- Maven 3.9+ (or use your IDE's bundled Maven)
- Node.js 18+ and npm
- A MongoDB Atlas cluster (free tier is fine) and its connection string
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

## 2. Backend setup

```bash
cd backend
```

Open `src/main/resources/application.properties` and set:

```properties
spring.data.mongodb.uri=mongodb+srv://<user>:<password>@<cluster-url>/marketreply?retryWrites=true&w=majority
gemini.api-key=${GEMINI_API_KEY:your-gemini-api-key-here}
jwt.secret=${JWT_SECRET:change-this-default-dev-only-secret-key-please-32chars-min}
```

The app now has accounts: every seller profile belongs to whoever created it, enforced with a JWT issued at login/register. For local dev the default `jwt.secret` works fine; for anything shared or deployed, set a real `JWT_SECRET` environment variable (any random 32+ character string) instead of relying on the default.

You can either paste the values directly, or export environment variables before
running (recommended, keeps secrets out of the file):

```bash
export GEMINI_API_KEY="your-real-gemini-key"
export MONGODB_URI="mongodb+srv://..."   # then reference ${MONGODB_URI} in the properties file
```

Run the backend:

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Interactive API docs are available at
`http://localhost:8080/swagger-ui.html`.

> Note: `mvnw` in this project is a placeholder script (no network access was
> available while generating this project to download the real Maven Wrapper
> jar). If you have Maven installed, just use `mvn` as shown above. To generate
> a real wrapper, run once: `mvn -N io.takari:maven:wrapper -Dmaven=3.9.6`.

---

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and proxies `/api/*` calls to the
backend at `http://localhost:8080` (see `vite.config.js`).

---

## 4. Using the app

1. **Sign up** at `/register` (or log in at `/login` if you already have an account).
2. Go to **Seller Settings** and create a seller profile: product, listed price,
   minimum acceptable price, delivery/pickup options, accepted payment methods,
   and negotiation style. This is private to your account — only you can edit
   or delete it.
3. Go to **Buyer Analyzer** — this is a public marketplace view. Any logged-in
   user can browse **every** seller's listing (not just their own) and pick
   one to message. Paste a buyer message (e.g. *"Can you sell it for ₹500 and
   deliver today?"*) against any listing.
4. Gemini returns the buyer's intent, extracted price/payment/delivery details,
   whether the request complies with that seller's rules, and a suggested reply.
5. Every analysis is saved. **History** shows both sides of your account: messages
   sent *to* your own listings (as the seller), and messages *you* sent to other
   sellers (as a buyer) — each is labeled accordingly. **Dashboard** and
   **Analytics** only reflect activity on listings you own.

---

## 5. Project structure

```
frontend/   React + Vite + Tailwind app (components, pages, services, hooks)
backend/    Spring Boot app (controllers, services, repositories, models, Gemini integration)
```

See the full folder tree in the original project brief — this repo mirrors it
exactly, including `config/`, `controller/`, `service/`, `repository/`, `model/`,
`dto/`, `mapper/`, `prompt/`, `parser/`, `exception/`, `util/`, and `security/`
packages on the backend, and `components/{common,dashboard,seller,buyer,history}`,
`pages/`, `services/`, `hooks/`, `context/`, `utils/`, `routes/`, and `styles/`
on the frontend.

---

## 6. REST API summary

| Method | Endpoint                         | Description                              |
|--------|-----------------------------------|-------------------------------------------|
| POST   | `/api/auth/register`              | Create an account (name, email, password) |
| POST   | `/api/auth/login`                 | Log in, returns a JWT                     |
| GET    | `/api/auth/me`                    | Get the current user (requires JWT)       |
| POST   | `/api/sellers`                    | Create a seller profile (requires JWT)    |
| GET    | `/api/sellers`                    | List your own sellers (requires JWT)      |
| GET    | `/api/sellers/marketplace`        | Browse every seller's listing (public marketplace, requires JWT) |
| GET    | `/api/sellers/{id}`               | Get one seller you own                    |
| PUT    | `/api/sellers/{id}`               | Update a seller profile you own           |
| DELETE | `/api/sellers/{id}`               | Delete a seller profile you own           |
| POST   | `/api/ai/analyze`                 | Analyze a buyer message (`sellerId`, `message`) with Gemini and save it |
| GET    | `/api/conversations?sellerId=`    | List conversation history for your own sellers |
| GET    | `/api/conversations/{id}`         | Get one conversation you have access to   |
| GET    | `/api/dashboard`                  | Aggregated stats scoped to your own data  |

All endpoints except `/api/auth/register` and `/api/auth/login` require an `Authorization: Bearer <token>` header, which the frontend attaches automatically once you're logged in.

---

## 7. Notes & next steps

- The optional `ApiKeyFilter` (disabled by default) can protect write endpoints
  in a shared/demo deployment — enable it via `security.api-key.enabled=true`
  and set `security.api-key.value`.
- `GeminiJsonParser` fails gracefully: if Gemini ever returns malformed JSON,
  the app still saves a fallback analysis instead of erroring out.
- CORS is currently scoped to `http://localhost:5173` for local development —
  update `CorsConfig.java` with your production frontend origin before deploying.
