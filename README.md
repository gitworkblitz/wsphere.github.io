<<<<<<< HEAD
# WorkSphere — Full-Stack Workforce Platform

A complete workforce platform built with React + FastAPI + Firebase.

## 🚀 Features

- **Authentication** — Firebase Auth (email/password)
- **Service Marketplace** — Browse, search, and book local services
- **Booking System** — Calendar with time slots, status tracking
- **Worker Matching** — Smart scoring algorithm (no ML, lightweight)
- **Live Tracking** — Real-time booking status updates
- **Payment System** — Razorpay integration (INR ₹) with mock mode
- **Invoice Generation** — Auto GST-compliant invoices
- **Job Portal** — Post/find full-time, part-time, contract jobs
- **Gig Marketplace** — Post/browse freelance gigs
- **AI Chatbot** — OpenRouter-powered assistant with smart fallback
- **Admin Dashboard** — User management, analytics, content moderation

## 📁 Project Structure

```
WorkSphere/
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── db/           # Firebase Firestore
│   │   ├── models/       # Pydantic models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers, security
│   ├── .env              # Backend env vars
│   └── requirements.txt
│
└── frontend/             # React + Vite frontend
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth & Cart context
    │   ├── layout/       # Page layouts
    │   ├── pages/        # All app pages
    │   ├── routes/       # Protected routing
    │   └── services/     # API & Firebase clients
    ├── .env              # Frontend env vars
    └── package.json
```

## ⚙️ Setup

### 1. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Download service account key → save as `backend/firebase-credentials.json`
5. Copy web config → update `frontend/.env`

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Fill in your values
python run.py
```
Backend runs on: **http://localhost:8000**

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env      # Fill in Firebase config
npm run dev
```
Frontend runs on: **http://localhost:5173**

## 🔧 Environment Variables

### Backend (`backend/.env`)
```
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
OPENROUTER_API_KEY=YOUR_API_KEY_HERE
```

### Frontend (`frontend/.env`)
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```

## 👤 Default User Types
- **customer** — Book services, apply for jobs
- **worker** — Offer services, create gigs
- **admin** — Full platform management (set via Firebase/Admin API)

## 🔑 Making a User Admin
In Firebase Console → Firestore → `users` collection → find user doc → set `user_type: "admin"`

## 💳 Payment (Mock Mode)
Razorpay works in mock/dev mode without real keys. Payments will be simulated.
For production, add real Razorpay keys.

## 🤖 Chatbot
Uses OpenRouter API. Replace `YOUR_API_KEY_HERE` in `backend/.env` with your key from https://openrouter.ai
Falls back to smart keyword responses if API is unavailable.

## 📋 Firestore Collections
- `users` — User profiles
- `services` — Service listings
- `bookings` — Service bookings
- `jobs` — Job postings
- `job_applications` — Job applications
- `gigs` — Freelance gigs
- `gig_proposals` — Gig proposals
- `payments` — Payment records
- `invoices` — Generated invoices
- `workers` — Worker profiles
=======
# gitworkblitz.github.io
>>>>>>> 02ba521c3822239731e42ce76a8c523433227ad2
