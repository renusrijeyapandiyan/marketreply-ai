# 🤖 MarketReply AI

**MarketReply AI** is an AI-powered web application that helps marketplace sellers generate professional responses to buyer messages. The system analyzes buyer intent using **Google Gemini 2.5 Flash**, checks whether the buyer's request follows the seller's predefined rules, and generates a ready-to-send reply.

---

## 📌 Project Overview

MarketReply AI simplifies communication between online marketplace sellers and buyers by using Artificial Intelligence.

The application allows sellers to:

- Create personalized seller profiles.
- Define negotiation rules (minimum price, delivery options, payment methods, etc.).
- Analyze buyer messages using Google Gemini AI.
- Generate smart, rule-compliant responses instantly.
- View conversation history and analytics through an interactive dashboard.

---

## 🚀 Features

### 👤 User Authentication
- Secure user registration and login
- JWT-based authentication
- Each seller profile belongs only to its owner

### 🛍 Seller Profile Management
- Create and manage multiple seller profiles
- Configure:
  - Product information
  - Listed price
  - Minimum acceptable price
  - Delivery/Pickup options
  - Accepted payment methods
  - Negotiation style

### 🤖 AI Buyer Message Analysis
- Analyze buyer messages using Google Gemini 2.5 Flash
- Detect buyer intent
- Extract important details such as:
  - Offered price
  - Delivery request
  - Payment preference
- Verify whether the buyer's request follows seller rules
- Generate a professional reply ready to send

### 📜 Conversation History
- Automatically save every AI analysis
- View previous buyer conversations
- Access conversation details anytime

### 📊 Dashboard & Analytics
- Total conversations
- Seller-wise statistics
- Buyer interaction analytics
- Activity overview

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend
- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- Spring WebClient

## Database
- MongoDB Atlas

## AI Integration
- Google Gemini 2.5 Flash
- Google Generative Language REST API

---

# 📂 Project Structure

```
MarketReply-AI
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── routes/
│   ├── context/
│   └── styles/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── mapper/
│   ├── parser/
│   ├── prompt/
│   ├── security/
│   ├── util/
│   └── exception/
│
└── README.md
```

---

# ⚙ Prerequisites

Before running the project, install:

- Java 17+
- Maven 3.9+
- Node.js 18+
- npm
- MongoDB Atlas Account
- Google Gemini API Key

---

# 🔧 Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Configure `application.properties`

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketreply

gemini.api-key=${GEMINI_API_KEY}

jwt.secret=${JWT_SECRET}
```

Or set environment variables:

```bash
export GEMINI_API_KEY=your_api_key

export JWT_SECRET=your_secret_key

export MONGODB_URI=your_connection_string
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

Swagger API:

```
http://localhost:8080/swagger-ui.html
```

---

# 💻 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🧠 How It Works

1. Register or log in.
2. Create a seller profile.
3. Enter seller rules:
   - Minimum price
   - Delivery options
   - Payment methods
   - Negotiation style
4. Open Buyer Analyzer.
5. Paste a buyer message.
6. Gemini AI analyzes the message.
7. The application displays:
   - Buyer Intent
   - Extracted Details
   - Rule Compliance
   - Suggested Reply
8. Analysis is automatically saved for future reference.

---

# 🌐 REST API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Current user |
| POST | `/api/sellers` | Create seller profile |
| GET | `/api/sellers` | Get all seller profiles |
| GET | `/api/sellers/{id}` | Get seller profile |
| PUT | `/api/sellers/{id}` | Update seller profile |
| DELETE | `/api/sellers/{id}` | Delete seller profile |
| POST | `/api/ai/analyze` | Analyze buyer message |
| GET | `/api/conversations` | Conversation history |
| GET | `/api/conversations/{id}` | Conversation details |
| GET | `/api/dashboard` | Dashboard statistics |

> **Note:** All endpoints except **Register** and **Login** require a JWT token.

---

# 🔐 Security

- JWT Authentication
- Spring Security
- Protected REST APIs
- User-specific seller profiles
- Secure AI request handling

---

# 📈 Future Enhancements

- Multi-language support
- Voice-to-text buyer analysis
- WhatsApp & Telegram integration
- Marketplace API integration
- AI-powered negotiation suggestions
- Email notifications
- Cloud deployment with Docker & Kubernetes

---

# 👨‍💻 Author

**Renu Sri J**

AI & Machine Learning Student

Passionate about building intelligent web applications using AI, Spring Boot, React, and Machine Learning.

---

## ⭐ If you found this project useful, don't forget to star the repository!
