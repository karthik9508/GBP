# 🚀 GBP Pro - Google Business Profile Management Suite

> **Automate your Google Business Profile.** Schedule posts, respond to reviews with AI, and optimize your local SEO—all in one place.

**Built for Indian businesses. Powered by Next.js, Supabase, and Razorpay.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-072654)](https://razorpay.com/)

---

## 🎯 What is GBP Pro?

GBP Pro helps local businesses maximize their Google Business Profile visibility through:
- **🗓️ Automated Post Scheduling** - Never miss a post again
- **🤖 AI Review Responses** - Respond professionally using GPT-4
- **📊 Profile Audits** - Know exactly what to fix
- **💰 Affordable Pricing** - Starting at just ₹499/month

Perfect for restaurants, salons, gyms, clinics, real estate agents, and any local business that wants more customers from Google.

---

## ⚡ Quick Start

**Get up and running in 5 minutes:**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/gbp-pro.git
cd gbp-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Initialize database
npx prisma generate
npx prisma migrate dev

# 5. Run development server
npm run dev
```

**Open [http://localhost:3000](http://localhost:3000)** - You're ready to go! 🎉

For detailed setup instructions, see the [Getting Started](#-getting-started) section below.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 **Free GBP Audit Tool**
Get instant insights into your Google Business Profile health.
- **30-second analysis** - No login required
- **Comprehensive scoring** - 0-100 score with detailed breakdown
- **Actionable recommendations** - Know exactly what to fix
- **Competitor comparison** - See how you stack up
- **Email report** - Get a PDF summary delivered to your inbox

### 📅 **Smart Post Scheduler**
Never forget to post on Google Business Profile again.
- **Schedule weeks in advance** - Set it and forget it
- **All post types supported** - Updates, Offers, Events, Products
- **Beautiful calendar view** - See your content pipeline at a glance
- **Image optimization** - Auto-resize and compress images
- **Automated publishing** - Posts go live automatically via cron jobs
- **Bulk actions** - Schedule multiple posts at once

### 🤖 **AI Review Response Generator**
Respond to every review professionally, powered by GPT-4.
- **Auto-fetch reviews** - Sync all reviews from Google
- **Smart AI responses** - Context-aware, personalized replies
- **Multiple tones** - Professional, Friendly, or Apologetic
- **One-click posting** - Approve and post in seconds
- **Response templates** - Save time with pre-written templates
- **Review analytics** - Track response rates and sentiment

### 💳 **Flexible Subscription Plans**
Pay only for what you need, with no hidden fees.
- **Razorpay integration** - All Indian payment methods (UPI, Cards, Net Banking, Wallets)
- **Multiple tiers** - Free audit, Starter (₹499/month), Pro (₹999/month)
- **Lifetime deal** - ₹4,999 one-time payment (first 50 customers only)
- **7-day free trial** - No credit card required
- **Cancel anytime** - No long-term commitments

### 📊 **Dashboard & Analytics**
Stay on top of your Google Business Profile performance.
- **Upcoming posts** - See what's scheduled for the next 30 days
- **Recent reviews** - Never miss a customer review
- **Audit history** - Track your optimization progress over time
- **Usage metrics** - Monitor AI credits and post limits

---

## 🛠 Tech Stack

### **Core Technologies**

| Category | Technology | Why We Chose It |
|----------|-----------|-----------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework with server components, API routes, and excellent SEO |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety reduces bugs, better developer experience |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Utility-first CSS with beautiful pre-built components |
| **Backend** | Next.js API Routes | No separate backend needed, serverless functions |

### **Database & Authentication**

| Service | Purpose | Features |
|---------|---------|----------|
| **[Supabase](https://supabase.com/)** | PostgreSQL Database | Hosted Postgres with real-time subscriptions |
| **Supabase Auth** | User Authentication | Google OAuth, email/password, magic links |
| **Supabase Storage** | File Storage | CDN-backed storage for post images |
| **[Prisma](https://www.prisma.io/)** | ORM | Type-safe database queries, migrations |

### **External APIs**

| API | Purpose | Usage |
|-----|---------|-------|
| **Google Business Profile API** | GBP data management | Fetch/create posts, reviews, business info |
| **OpenAI API** (GPT-4o-mini) | AI review responses | Generate personalized review responses |
| **[Razorpay](https://razorpay.com/)** | Payment processing | UPI, Cards, Net Banking, Wallets |

### **Infrastructure & DevOps**

| Service | Purpose | Cost |
|---------|---------|------|
| **[Vercel](https://vercel.com/)** | Hosting & Deployment | Free tier (hobby), $20/month (pro) |
| **Vercel Cron** | Scheduled tasks | Free with Vercel hosting |
| **[Resend](https://resend.com/)** | Transactional emails | Free tier: 3,000 emails/month |
| **[Sentry](https://sentry.io/)** | Error tracking | Free tier: 5,000 errors/month |
| **[Posthog](https://posthog.com/)** | Product analytics | Free tier: 1M events/month |

### **Development Tools**

- **React Hook Form** + **Zod** - Type-safe form handling and validation
- **FullCalendar** - Interactive calendar for post scheduling
- **Recharts** - Data visualization for audit scores
- **ESLint** + **Prettier** - Code quality and formatting

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign up](https://supabase.com/))
- **Google Cloud Account** (for GBP API)
- **Razorpay Account** ([Sign up](https://razorpay.com/))
- **OpenAI Account** ([Sign up](https://platform.openai.com/))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gbp-pro.git
cd gbp-pro
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to **Project Settings** → **API**
3. Copy your **Project URL** and **anon public key**
4. Go to **Database** → **Tables** and run the SQL from `prisma/schema.prisma` (or use Prisma migrations)

### 4. Set Up Google Business Profile API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Business Profile Performance API**
4. Create **OAuth 2.0 credentials**:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Download credentials JSON

### 5. Set Up Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up and complete KYC verification (required for live transactions)
3. Go to **Settings** → **API Keys**
4. Generate **Test Keys** (for development) and **Live Keys** (for production)
5. Copy **Key ID** and **Key Secret**
6. Enable payment methods: **Settings** → **Configuration** → Enable UPI, Cards, Net Banking, Wallets
7. Set up webhook (after deployment):
   - Go to **Settings** → **Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`, `subscription.charged`, `subscription.cancelled`
   - Copy **Webhook Secret**

### 6. Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add billing information (pay-as-you-go)

### 7. Configure Environment Variables

Create a `.env.local` file in the root directory (see [Environment Variables](#-environment-variables) section below).

### 8. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with test data
npx prisma db seed
```

### 9. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# ==========================================
# APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ==========================================
# SUPABASE (Database + Auth + Storage)
# ==========================================
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database connection string
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:your-password@db.projectid.supabase.co:5432/postgres

# ==========================================
# GOOGLE OAUTH & GBP API
# ==========================================
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# ==========================================
# OPENAI (AI Review Responses)
# ==========================================
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-openai-api-key

# ==========================================
# RAZORPAY (Payment Gateway)
# ==========================================
# Get from: https://dashboard.razorpay.com/app/keys
# TEST KEYS (for development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=whsec_your_webhook_secret

# LIVE KEYS (for production - replace after KYC approval)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
# RAZORPAY_KEY_SECRET=your_live_key_secret
# RAZORPAY_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# ==========================================
# RESEND (Transactional Emails)
# ==========================================
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# ==========================================
# NEXTAUTH (Session Management)
# ==========================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-32-character-string-here
NEXTAUTH_URL=http://localhost:3000

# ==========================================
# MONITORING (Optional but Recommended)
# ==========================================
# Sentry - Error Tracking
# Get from: https://sentry.io/settings/projects/your-project/keys/
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id

# Posthog - Product Analytics
# Get from: https://app.posthog.com/project/settings
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 📝 How to Get Each API Key

<details>
<summary><b>Supabase Setup</b></summary>

1. Go to [supabase.com](https://supabase.com/) and create account
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Project Settings** → **Database** → Copy connection string → `DATABASE_URL`
</details>

<details>
<summary><b>Google OAuth & GBP API</b></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Business Profile API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (dev)
   - `https://yourdomain.com/api/auth/google/callback` (prod)
8. Copy **Client ID** and **Client Secret**
</details>

<details>
<summary><b>OpenAI API</b></summary>

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up and add payment method
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-proj-...`)
5. **Important:** Set usage limits to avoid unexpected charges
</details>

<details>
<summary><b>Razorpay Setup</b></summary>

1. Go to [razorpay.com](https://razorpay.com/)
2. Sign up with business details
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Key** (for development)
5. Copy **Key ID** (starts with `rzp_test_`) and **Key Secret**
6. For webhooks:
   - Go to **Settings** → **Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Copy **Webhook Secret**
7. For production: Complete KYC, then generate **Live Keys**
</details>

<details>
<summary><b>Generate NEXTAUTH_SECRET</b></summary>

Run this command in terminal:
```bash
openssl rand -base64 32
```
Copy the output to `NEXTAUTH_SECRET`
</details>

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 📁 Project Structure

```
gbp-pro/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/              # Authenticated pages
│   │   ├── audit/
│   │   │   └── page.tsx
│   │   ├── scheduler/
│   │   │   └── page.tsx
│   │   ├── reviews/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/                      # API routes
│   │   ├── audit/
│   │   │   └── route.ts
│   │   ├── auth/
│   │   │   ├── google/
│   │   │   │   ├── route.ts
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── signup/
│   │   │       └── route.ts
│   │   ├── businesses/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── reviews/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── respond/
│   │   │       │   └── route.ts
│   │   │       └── generate/
│   │   │           └── route.ts
│   │   ├── razorpay/
│   │   │   ├── create-order/
│   │   │   │   └── route.ts
│   │   │   ├── verify-payment/
│   │   │   │   └── route.ts
│   │   │   ├── webhook/
│   │   │   │   └── route.ts
│   │   │   ├── create-subscription/
│   │   │   │   └── route.ts
│   │   │   └── cancel-subscription/
│   │   │       └── route.ts
│   │   └── cron/
│   │       ├── publish-posts/
│   │       │   └── route.ts
│   │       └── sync-reviews/
│   │           └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── audit/
│   │   ├── AuditForm.tsx
│   │   ├── AuditResults.tsx
│   │   └── ScoreGauge.tsx
│   ├── scheduler/
│   │   ├── PostCalendar.tsx
│   │   ├── PostEditor.tsx
│   │   └── PostCard.tsx
│   ├── reviews/
│   │   ├── ReviewList.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ResponseGenerator.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── lib/                          # Utility functions
│   ├── db.ts                     # Prisma client
│   ├── google/
│   │   ├── auth.ts               # Google OAuth
│   │   ├── gbp.ts                # GBP API client
│   │   └── types.ts              # TypeScript types
│   ├── openai.ts                 # OpenAI client
│   ├── razorpay.ts               # Razorpay client
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   └── server.ts             # Supabase server client
│   ├── audit/
│   │   └── scoring.ts            # Audit scoring algorithm
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── types/
│   └── index.ts                  # Global TypeScript types
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Example env file
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js
├── PRD.md                        # Product Requirements Document
└── README.md                     # This file
```

---

## 💻 Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run type-check

# Database commands
npx prisma studio              # Open Prisma Studio (DB GUI)
npx prisma migrate dev         # Create and apply migration
npx prisma migrate reset       # Reset database
npx prisma generate            # Generate Prisma Client
npx prisma db seed             # Seed database
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run before committing:
```bash
npm run lint
npm run format
npm run type-check
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

**Commit Message Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Use production values (not test/dev)

4. **Configure Cron Jobs**
   - Create `vercel.json` in root:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/publish-posts",
         "schedule": "*/15 * * * *"
       },
       {
         "path": "/api/cron/sync-reviews",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

5. **Deploy**
   - Vercel automatically deploys on every push to `main`
   - Production URL: `https://your-project.vercel.app`

6. **Custom Domain** (Optional)
   - Add custom domain in Vercel Dashboard
   - Update DNS records
   - SSL certificate auto-generated

### Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Update Google OAuth redirect URI to production
- [ ] Update Razorpay webhook endpoint to production
- [ ] Switch Razorpay from test keys to live keys
- [ ] Test all features in production
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure Sentry for error tracking
- [ ] Set up daily backup for database

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

---

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

---

#### GET `/api/auth/google`
Initiate Google OAuth flow.

Redirects to Google OAuth consent screen.

---

### Audit Endpoints

#### POST `/api/audit`
Run audit on a Google Business Profile.

**Request Body:**
```json
{
  "businessName": "Example Restaurant",
  "email": "owner@example.com" // optional
}
```

**Response:**
```json
{
  "score": 75,
  "profileComplete": 22,
  "contentActivity": 28,
  "engagement": 25,
  "issues": [
    {
      "category": "content",
      "severity": "medium",
      "message": "No posts in last 30 days",
      "recommendation": "Post at least 3 times per month"
    }
  ]
}
```

---

### Post Endpoints

#### GET `/api/posts`
List all posts for authenticated user.

**Query Parameters:**
- `status` - Filter by status (scheduled, published, failed)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "type": "UPDATE",
      "content": "Check out our new menu!",
      "imageUrl": "https://...",
      "scheduledAt": "2026-02-15T10:00:00Z",
      "status": "scheduled"
    }
  ],
  "total": 45
}
```

---

#### POST `/api/posts`
Create a new scheduled post.

**Request Body:**
```json
{
  "businessId": "biz_123",
  "type": "UPDATE",
  "content": "We're open this weekend!",
  "imageUrl": "https://...",
  "scheduledAt": "2026-02-20T09:00:00Z"
}
```

---

### Review Endpoints

#### GET `/api/reviews`
Fetch reviews for a business.

**Query Parameters:**
- `businessId` - Required
- `rating` - Filter by star rating (1-5)
- `responded` - Filter by response status (true/false)

---

#### POST `/api/reviews/:id/generate`
Generate AI response for a review.

**Request Body:**
```json
{
  "tone": "professional" // professional, friendly, apologetic
}
```

**Response:**
```json
{
  "response": "Thank you so much for your kind words, John! We're thrilled you enjoyed..."
}
```

---

### Razorpay Endpoints

#### POST `/api/razorpay/create-order`
Create a Razorpay order for one-time payment.

**Request Body:**
```json
{
  "amount": 49900, // Amount in paise (₹499)
  "currency": "INR",
  "receipt": "receipt_order_123",
  "planType": "starter"
}
```

**Response:**
```json
{
  "id": "order_xyz123",
  "amount": 49900,
  "currency": "INR",
  "receipt": "receipt_order_123"
}
```

---

#### POST `/api/razorpay/create-subscription`
Create a Razorpay subscription.

**Request Body:**
```json
{
  "planId": "plan_xyz",
  "customerNotify": 1,
  "totalCount": 12 // For annual plans
}
```

---

#### POST `/api/razorpay/verify-payment`
Verify Razorpay payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_string"
}
```

**Response:**
```json
{
  "verified": true,
  "payment": {
    "id": "payment_123",
    "status": "captured"
  }
}
```

---

#### POST `/api/razorpay/webhook`
Handle Razorpay webhook events.

Events handled:
- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `subscription.charged` - Subscription payment
- `subscription.cancelled` - Subscription cancelled
- `subscription.halted` - Subscription halted

---

For complete API documentation, see `docs/API.md` (to be created).

---

## 🗄️ Database Schema

### Users Table
```prisma
model User {
  id                     String   @id @default(cuid())
  email                  String   @unique
  googleId               String?  @unique
  passwordHash           String?
  subscriptionTier       String   @default("free")
  razorpayCustomerId     String?  @unique
  razorpaySubscriptionId String?  @unique
  subscriptionStatus     String?  @default("inactive")
  subscriptionEndDate    DateTime?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}
```

### Businesses Table
```prisma
model Business {
  id                String   @id @default(cuid())
  userId            String
  gbpLocationId     String   @unique
  name              String
  address           String?
  phone             String?
  accessToken       String?  // Encrypted
  refreshToken      String?  // Encrypted
  createdAt         DateTime @default(now())
}
```

### Posts Table
```prisma
model Post {
  id                String   @id @default(cuid())
  businessId        String
  type              String   // UPDATE, OFFER, EVENT
  content           String   @db.Text
  imageUrl          String?
  scheduledAt       DateTime
  publishedAt       DateTime?
  status            String   @default("scheduled")
  createdAt         DateTime @default(now())
}
```

For complete schema, see `prisma/schema.prisma`.

---

---

## ❓ FAQ

<details>
<summary><b>Why Razorpay instead of Stripe?</b></summary>

For Indian businesses, Razorpay is superior:
- Lower fees (2% vs Stripe's 2.9%)
- Native UPI support (most popular payment method in India)
- Faster settlements (T+1 vs T+7)
- Better support for Indian payment methods
- Easier KYC for Indian businesses

See [RAZORPAY_GUIDE.md](RAZORPAY_GUIDE.md) for detailed comparison.
</details>

<details>
<summary><b>Can I use this for multiple businesses?</b></summary>

Yes! The Pro plan (₹999/month) supports up to 3 locations. For more than 3 locations, we'll have an Enterprise plan (coming in Phase 3).
</details>

<details>
<summary><b>How does the AI review response work?</b></summary>

We use OpenAI's GPT-4o-mini model to generate contextual, personalized responses. The AI:
1. Analyzes the review sentiment and content
2. Considers your business type and tone preference
3. Generates a professional response
4. You can edit before posting

Each response costs us ~₹0.08 in API fees, but we include 10-unlimited responses depending on your plan.
</details>

<details>
<summary><b>Is my Google Business Profile data safe?</b></summary>

Absolutely. We:
- Only request minimal permissions needed
- Encrypt OAuth tokens at rest
- Never store customer review content permanently
- Comply with Google's API Terms of Service
- Use Supabase's enterprise-grade security

Read our [Privacy Policy](https://yoursite.com/privacy) and [Terms of Service](https://yoursite.com/terms) for details.
</details>

<details>
<summary><b>What happens if a scheduled post fails?</b></summary>

Our system:
1. Retries failed posts 3 times (every 15 minutes)
2. Sends you an email notification if all retries fail
3. Logs the error in your dashboard
4. You can manually retry or reschedule

Common failure reasons: expired Google OAuth token (we'll prompt you to reconnect).
</details>

<details>
<summary><b>Can I cancel my subscription anytime?</b></summary>

Yes! No long-term commitments:
- Cancel anytime from your dashboard
- You keep access until the end of your billing period
- No cancellation fees
- We'll even send you an export of your data

We'd love your feedback on why you're leaving though!
</details>

<details>
<summary><b>Do you offer refunds?</b></summary>

Yes, we offer a 7-day money-back guarantee:
- If you're not satisfied within 7 days of purchase, email us
- We'll refund 100%, no questions asked
- Applies to both monthly and annual plans
- Lifetime deals are final sale (since they're heavily discounted)
</details>

<details>
<summary><b>Will this work for agencies managing multiple clients?</b></summary>

Not yet, but it's on the roadmap! Phase 3 (Weeks 4-7) will include:
- Multi-location dashboard
- Team collaboration features
- White-label option
- Agency-specific pricing

Want early access? Email us at support@gbppro.com
</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these amazing open-source projects:
- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- [OpenAI](https://openai.com/) - AI capabilities
- [Razorpay](https://razorpay.com/) - Payment infrastructure

Special thanks to the Next.js, Supabase, and open-source communities! 🙌

---

## 📞 Support & Community

### 💬 Get Help
- **Email:** support@gbppro.com
- **Documentation:** [docs.gbppro.com](https://docs.gbppro.com) *(coming soon)*
- **GitHub Issues:** [Report a bug](https://github.com/yourusername/gbp-pro/issues)
- **Discord Community:** [Join our Discord](https://discord.gg/gbppro) *(coming soon)*

### 🐛 Found a Bug?
Please [open an issue](https://github.com/yourusername/gbp-pro/issues/new) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

### 💡 Feature Request?
We'd love to hear your ideas! [Open a feature request](https://github.com/yourusername/gbp-pro/issues/new?template=feature_request.md) or vote on existing ones.

### 📧 Business Inquiries
For partnerships, white-label licensing, or enterprise plans, contact: business@gbppro.com

---

## 🌟 Show Your Support

If you find this project useful:
- ⭐ Star this repository
- 🐦 [Tweet about it](https://twitter.com/intent/tweet?text=Check%20out%20GBP%20Pro%20-%20Automate%20your%20Google%20Business%20Profile!%20https://github.com/yourusername/gbp-pro)
- 📝 Write a blog post about your experience
- 🗣️ Tell other business owners

Every star motivates us to keep improving! ⭐

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/gbp-pro?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/gbp-pro?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/gbp-pro)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/gbp-pro)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/gbp-pro)

---

**Built with ❤️ in India for local businesses worldwide**

**Made by:** [Your Name](https://yourwebsite.com)  
**License:** MIT  
**Version:** 1.0.0  
**Last Updated:** February 10, 2026

---

### 🚀 Ready to get started?

```bash
git clone https://github.com/yourusername/gbp-pro.git
cd gbp-pro
npm install
npm run dev
```

**Questions?** Open an issue or email support@gbppro.com

**Happy building! 🎉**

---

## 📸 Screenshots

> **Note:** Add screenshots after building the UI. Suggested screenshots:
> - Homepage with audit tool
> - Dashboard view
> - Post scheduler calendar
> - AI review response generator
> - Pricing page

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Weeks 1-2) - COMPLETE
- [x] Free audit tool
- [x] Post scheduler with calendar view
- [x] AI review response generator
- [x] Razorpay payment integration
- [x] User authentication (Google OAuth)
- [x] Database setup with Prisma + Supabase

### 🚀 Phase 2: Launch (Week 3) - IN PROGRESS
- [ ] Product Hunt launch
- [ ] Landing page optimization
- [ ] Customer onboarding flow
- [ ] Email drip campaigns
- [ ] First 10 paying customers

### 📈 Phase 3: Growth (Weeks 4-7)
- [ ] Multi-location support for agencies
- [ ] Post templates library (20+ templates)
- [ ] Analytics dashboard
- [ ] Competitor comparison tool
- [ ] Instagram/Facebook cross-posting
- [ ] Mobile responsive improvements

### 🎯 Phase 4: Scale (Months 2-6)
- [ ] White-label option for marketing agencies
- [ ] Public API for developers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics & reporting
- [ ] Team collaboration features
- [ ] International expansion (USA, UK, Australia)
- [ ] Integration marketplace (Zapier, Make, etc.)

### 💡 Future Ideas (Backlog)
- Automated post content generation (full AI writing)
- Voice notes to posts (speech-to-text)
- Bulk business management (100+ locations)
- Franchise-specific features
- API rate limiting & monetization
- SMS notifications for reviews
- Chrome extension for quick posting

---

## 📊 Project Status

| Metric | Target | Current |
|--------|--------|---------|
| **Version** | 1.0.0 | 0.9.0 (Beta) |
| **Status** | Launch Ready | In Development |
| **Launch Date** | Week 3 | TBD |
| **Revenue Goal** | $200 by March 31 | $0 |
| **Users** | 25 | 0 |
| **Features Complete** | 100% | 85% |

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-2) ✅
## 🤝 Contributing