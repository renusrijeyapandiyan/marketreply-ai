# 🤖 MarketReply AI

### AI-Powered Buyer Message Analyzer & Smart Reply Generator

**MarketReply AI** is an AI-powered web application designed to help online marketplace sellers handle buyer conversations more efficiently.

The application uses **Google Gemini 2.5 Flash** to analyze buyer messages, identify buyer intent, extract important information such as offered price and preferences, compare the request against the seller's predefined rules, and generate a professional, ready-to-send response.

🌐 **Live Application:** https://marketreply-ai-frontend.onrender.com

---

## 📌 Project Overview

Marketplace sellers often receive multiple buyer messages involving:

* Price negotiations
* Delivery requests
* Pickup requests
* Payment preferences
* Questions about products
* Negotiation attempts

Manually analyzing every message and creating an appropriate response can be time-consuming.

**MarketReply AI automates this process.**

The seller first defines their business rules, such as the minimum acceptable price, delivery options, accepted payment methods, and preferred negotiation style.

When a buyer sends a message, the AI analyzes it against those rules and produces an appropriate response.

### Example

**Seller Rules**

```text
Listed Price: ₹10,000
Minimum Price: ₹8,500
Delivery: Available
Pickup: Available
Payment: UPI, Cash
Negotiation Style: Friendly
```

**Buyer Message**

```text
Hi, I am interested in this product.
Can you give it for ₹8,000 and deliver it tomorrow?
```

**AI Analysis**

```text
Buyer Intent:
Price negotiation + Delivery request

Offered Price:
₹8,000

Seller Minimum:
₹8,500

Rule Compliance:
Price below minimum

Suggested Response:
The seller can politely reject the ₹8,000 offer
while offering the minimum acceptable price.
```

This allows the seller to make faster and more consistent decisions.

---

# 🚀 Live Demo

### 🌐 MarketReply AI

https://marketreply-ai-frontend.onrender.com

> **Note:** The application is deployed on Render. Depending on the hosting configuration and inactivity, the first request may take additional time while the service starts.

---

# ✨ Key Features

## 🔐 1. User Authentication

The application provides secure user authentication using:

* User registration
* User login
* JWT authentication
* Protected API endpoints
* User-specific data access

Each seller can access only their own seller profiles and conversation data.

---

# 👤 2. Seller Profile Management

Sellers can create and manage their marketplace selling rules.

Each seller profile can contain:

* Product information
* Listed price
* Minimum acceptable price
* Delivery options
* Pickup options
* Accepted payment methods
* Negotiation style

Example:

```text
Product:
iPhone 14

Listed Price:
₹45,000

Minimum Price:
₹40,000

Delivery:
Available

Pickup:
Available

Payment:
UPI / Cash

Negotiation Style:
Friendly
```

These rules are later used by the AI while analyzing buyer messages.

---

# 🤖 3. AI Buyer Message Analyzer

The core feature of MarketReply AI is the **Buyer Analyzer**.

The seller enters a buyer's message and the system sends it to the AI processing service.

The AI analyzes:

### Buyer Intent

Examples:

* Product inquiry
* Price negotiation
* Delivery request
* Pickup request
* Payment inquiry
* General interest

### Important Details

The system can extract information such as:

* Offered price
* Requested delivery
* Pickup preference
* Payment method
* Other buyer requirements

### Seller Rule Compliance

The extracted information is compared against the seller's predefined rules.

For example:

```text
Buyer Offered Price: ₹7,500
Seller Minimum Price: ₹8,000

Result:
❌ Below minimum acceptable price
```

---

# 💬 4. AI-Generated Reply

After analyzing the buyer's message, MarketReply AI generates a professional response.

The generated reply considers:

* Buyer intent
* Seller rules
* Offered price
* Delivery requirements
* Payment preferences
* Seller's negotiation style

Example:

```text
Buyer:
Can you sell it for ₹8,000?

Seller Minimum:
₹8,500
```

Possible AI response:

```text
Thanks for your interest! I can offer it for ₹8,500,
which is the best price I can provide. Please let me
know if that works for you.
```

The seller can then review and send the response through their marketplace.

---

# 📜 5. Conversation History

Every AI analysis can be stored for future reference.

Sellers can access previous buyer interactions and review:

* Original buyer message
* AI analysis
* Extracted buyer information
* Rule compliance
* Generated reply
* Conversation details

This provides a historical record of seller-buyer interactions.

---

# 📊 6. Analytics Dashboard

MarketReply AI provides an interactive dashboard to help sellers understand their activity.

Dashboard information includes:

* Total conversations
* Seller-wise statistics
* Buyer interactions
* Activity overview
* Conversation history

This gives sellers a quick overview of how they are interacting with potential buyers.

---

# 🛍️ 7. Marketplace Browsing

The project also includes marketplace browsing functionality that allows buyer-related information and marketplace context to be incorporated into the seller workflow.

This makes the application more than a simple chatbot by connecting AI analysis with marketplace-oriented seller operations.

---

# 🧠 How MarketReply AI Works

The overall workflow is:

```text
                    SELLER
                       │
                       ▼
              Create Seller Profile
                       │
                       ▼
             Define Selling Rules
                       │
                       ▼
              Buyer Sends Message
                       │
                       ▼
                Buyer Analyzer
                       │
                       ▼
              Google Gemini AI
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Intent    Details    Rules
          Analysis  Extraction  Check
             │         │         │
             └─────────┼─────────┘
                       ▼
               AI Reply Generator
                       │
                       ▼
              Suggested Response
                       │
                       ▼
              Save Conversation
                       │
                       ▼
                Dashboard / History
```

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│                 FRONTEND                    │
│                                             │
│ React + Vite + Tailwind CSS                 │
│ React Router + Axios                        │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│ Spring Boot                                 │
│ Spring Security                             │
│ JWT Authentication                          │
│ REST Controllers                            │
│ Service Layer                               │
└───────────────┬─────────────────┬───────────┘
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌─────────────────┐
       │ MongoDB Atlas  │  │ Google Gemini   │
       │                │  │ 2.5 Flash       │
       └────────────────┘  └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React        | User interface                  |
| Vite         | Frontend development/build tool |
| Tailwind CSS | Styling                         |
| Axios        | HTTP/API communication          |
| React Router | Client-side routing             |

## Backend

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| Java 17          | Backend programming language |
| Spring Boot      | Backend framework            |
| Spring Security  | Application security         |
| JWT              | Authentication               |
| Spring WebClient | External API communication   |

## Database

| Technology    | Purpose        |
| ------------- | -------------- |
| MongoDB Atlas | Cloud database |

## Artificial Intelligence

| Technology                     | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| Google Gemini 2.5 Flash        | Buyer message analysis and reply generation |
| Google Generative Language API | AI API integration                          |

## Deployment

| Platform      | Purpose             |
| ------------- | ------------------- |
| Render        | Application hosting |
| MongoDB Atlas | Cloud database      |

---

# 📂 Project Structure

```text
marketreply-ai/
│
├── backend/
│   │
│   ├── config/
│   │   └── Application configuration
│   │
│   ├── controller/
│   │   └── REST API controllers
│   │
│   ├── service/
│   │   └── Business logic
│   │
│   ├── repository/
│   │   └── Database repositories
│   │
│   ├── model/
│   │   └── Database/domain models
│   │
│   ├── dto/
│   │   └── Data Transfer Objects
│   │
│   ├── mapper/
│   │   └── Object mapping
│   │
│   ├── parser/
│   │   └── AI response parsing
│   │
│   ├── prompt/
│   │   └── AI prompt handling
│   │
│   ├── security/
│   │   └── JWT and security configuration
│   │
│   ├── util/
│   │   └── Utility classes
│   │
│   └── exception/
│       └── Exception handling
│
├── frontend/
│   │
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── pages/
│   │   └── Application pages
│   │
│   ├── services/
│   │   └── API services
│   │
│   ├── hooks/
│   │   └── Custom React hooks
│   │
│   ├── routes/
│   │   └── Application routes
│   │
│   ├── context/
│   │   └── React context
│   │
│   └── styles/
│       └── Styling
│
├── marketreply-ai/
│   └── Additional project resources
│
└── README.md
```

---

# ⚙️ Prerequisites

Before running the project locally, install:

* **Java 17+**
* **Maven 3.9+**
* **Node.js 18+**
* **npm**
* **MongoDB Atlas account**
* **Google Gemini API key**

---

# 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your application properties.

Example:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketreply

gemini.api-key=${GEMINI_API_KEY}

jwt.secret=${JWT_SECRET}
```

Set the required environment variables.

### Windows PowerShell

```powershell
$env:GEMINI_API_KEY="your_api_key"
$env:JWT_SECRET="your_secret_key"
$env:MONGODB_URI="your_mongodb_connection_string"
```

### Linux / macOS

```bash
export GEMINI_API_KEY=your_api_key
export JWT_SECRET=your_secret_key
export MONGODB_URI=your_connection_string
```

Start the Spring Boot backend:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

Never commit API keys, database credentials, or JWT secrets to GitHub.

Example backend configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Add environment files to `.gitignore`.

---

# 🧠 AI Processing Pipeline

MarketReply AI uses a structured AI-processing pipeline.

```text
Buyer Message
      │
      ▼
Input Validation
      │
      ▼
Buyer Intent Detection
      │
      ▼
Information Extraction
      │
      ├── Offered Price
      ├── Delivery Request
      ├── Pickup Request
      └── Payment Preference
      │
      ▼
Seller Rule Comparison
      │
      ├── Price Rules
      ├── Delivery Rules
      ├── Payment Rules
      └── Negotiation Rules
      │
      ▼
Response Generation
      │
      ▼
Professional Suggested Reply
```

---

# 📋 Example AI Analysis

### Seller Configuration

```text
Product:
Gaming Laptop

Listed Price:
₹80,000

Minimum Price:
₹72,000

Delivery:
Available

Payment:
UPI / Bank Transfer

Negotiation Style:
Professional
```

### Buyer Message

```text
Hi, I really like this laptop.
Would you accept ₹70,000?
Can you deliver it to my address?
```

### AI Analysis

```text
Intent:
Price negotiation + Delivery request

Offered Price:
₹70,000

Minimum Seller Price:
₹72,000

Delivery:
Requested

Price Compliance:
❌ Below minimum price

Suggested Action:
Reject ₹70,000 and provide minimum acceptable price.
```

### Suggested Reply

```text
Thank you for your interest in the laptop.
The lowest price I can offer is ₹72,000.
Delivery is available as well. Please let me know
if that works for you.
```

---

# 🌐 REST API

| Method   | Endpoint                  | Description              |
| -------- | ------------------------- | ------------------------ |
| `POST`   | `/api/auth/register`      | Register a new user      |
| `POST`   | `/api/auth/login`         | Login                    |
| `GET`    | `/api/auth/me`            | Get current user         |
| `POST`   | `/api/sellers`            | Create seller profile    |
| `GET`    | `/api/sellers`            | Get seller profiles      |
| `GET`    | `/api/sellers/{id}`       | Get seller profile       |
| `PUT`    | `/api/sellers/{id}`       | Update seller profile    |
| `DELETE` | `/api/sellers/{id}`       | Delete seller profile    |
| `POST`   | `/api/ai/analyze`         | Analyze buyer message    |
| `GET`    | `/api/conversations`      | Get conversation history |
| `GET`    | `/api/conversations/{id}` | Get conversation details |
| `GET`    | `/api/dashboard`          | Get dashboard statistics |

> All protected endpoints require a valid JWT token. Registration and login are public endpoints.

---

# 🔐 Authentication Flow

MarketReply AI uses JWT-based authentication.

```text
User
 │
 ▼
Register / Login
 │
 ▼
Spring Security
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend Stores Token
 │
 ▼
Authorization Header
 │
 ▼
Protected Backend Endpoint
```

Authenticated requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🗄️ Data Flow

```text
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ Seller Profile │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ Seller Rules    │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ Buyer Message  │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ Gemini AI      │
                  └───────┬────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Intent      Extraction     Rules
             │            │            │
             └────────────┼────────────┘
                          ▼
                   Suggested Reply
                          │
                          ▼
                       MongoDB
```

---

# 🔒 Security

The application implements several security mechanisms:

* JWT-based authentication
* Spring Security
* Protected REST APIs
* User-specific seller profiles
* Environment-based secret management
* Secure database connection
* Controlled access to AI functionality

Sensitive credentials such as:

```text
GEMINI_API_KEY
JWT_SECRET
MONGODB_URI
```

should never be committed to the repository.

---

# 🚀 Deployment

The application is deployed using **Render**.

### Production Application

```text
https://marketreply-ai-frontend.onrender.com
```

The production architecture consists of:

```text
User
  │
  ▼
Render Frontend
  │
  │ REST API
  ▼
Render Backend
  │
  ├──────────────► MongoDB Atlas
  │
  └──────────────► Google Gemini API
```

---

# 📊 Project Highlights

MarketReply AI demonstrates practical implementation of:

* Full-stack web development
* Generative AI integration
* Natural language processing
* REST API development
* JWT authentication
* Spring Security
* MongoDB database integration
* AI prompt engineering
* AI response parsing
* Seller rule-based decision making
* Dashboard analytics
* Cloud deployment

---

# 💡 Real-World Use Case

MarketReply AI can be useful for sellers operating on platforms such as:

* Online marketplaces
* Social commerce platforms
* Classified marketplaces
* Independent seller websites
* Small e-commerce businesses

The system can help reduce the time required to manually analyze and respond to repetitive buyer messages.

---

# 🔮 Future Enhancements

Potential improvements include:

### 🌍 Multilingual Support

Allow sellers to analyze and respond to buyers in multiple languages.

### 🎙️ Voice-to-Text

Allow sellers to submit buyer messages using voice input.

### 📱 Marketplace Integration

Connect directly with marketplace APIs to retrieve buyer messages automatically.

### 💬 WhatsApp / Telegram Integration

Allow sellers to manage conversations through messaging platforms.

### 🤝 AI Negotiation Assistant

Provide sellers with recommended negotiation strategies.

### 📧 Email Notifications

Notify sellers about important buyer interactions.

### 🐳 Docker Deployment

Containerize the frontend and backend for easier deployment.

### ☁️ Scalable Cloud Architecture

Deploy using scalable cloud infrastructure and container orchestration.

---

# 📚 What I Learned From This Project

Through MarketReply AI, I gained practical experience in:

* Building a full-stack application using React and Spring Boot
* Designing REST APIs
* Implementing JWT authentication
* Working with MongoDB Atlas
* Integrating Google Gemini with a backend application
* Designing prompts for structured AI responses
* Processing natural-language buyer messages
* Connecting AI decisions with business rules
* Building reusable frontend components
* Managing frontend/backend communication
* Deploying applications to the cloud
* Handling environment variables and production configuration

---

# 👨‍💻 Author

## Renu Sri Jeyapandiyan

**AI & Machine Learning Student**

Interested in:

* Artificial Intelligence
* Machine Learning
* Generative AI
* Natural Language Processing
* Full-Stack Development
* Java
* Spring Boot
* React

---

# 🔗 Project Links

🌐 **Live Demo:**
https://marketreply-ai-frontend.onrender.com

💻 **GitHub:**
https://github.com/renusrijeyapandiyan/marketreply-ai

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### Fork the repository

```bash
git clone https://github.com/renusrijeyapandiyan/marketreply-ai.git
```

### Create a branch

```bash
git checkout -b feature/new-feature
```

### Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

### Push your branch

```bash
git push origin feature/new-feature
```

Then open a Pull Request on GitHub.

---

# 📜 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

# ⭐ Support

If you found this project interesting or useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
🤝 Contribute

---

## 🚀 MarketReply AI — Turning Buyer Messages Into Smart Seller Responses

```text
Buyer Message
      ↓
AI Understands Intent
      ↓
Extracts Important Details
      ↓
Checks Seller Rules
      ↓
Generates Smart Reply
      ↓
Seller Reviews & Responds
```

**MarketReply AI combines Generative AI with marketplace business rules to make seller-buyer communication faster, smarter, and more consistent.**
