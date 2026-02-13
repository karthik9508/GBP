-- ==========================================
-- GBP Pro - Database Schema
-- Run this SQL in Supabase SQL Editor
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    google_id TEXT UNIQUE,
    password_hash TEXT,
    avatar_url TEXT,

    -- Subscription
    subscription_tier TEXT NOT NULL DEFAULT 'free',       -- free, starter, pro, lifetime
    razorpay_customer_id TEXT UNIQUE,
    razorpay_subscription_id TEXT UNIQUE,
    subscription_status TEXT NOT NULL DEFAULT 'inactive', -- active, inactive, cancelled, past_due
    subscription_end_date TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- BUSINESSES TABLE
-- ==========================================
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    gbp_location_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    category TEXT,
    website_url TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',

    -- OAuth tokens (encrypted)
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_user_id ON businesses(user_id);

-- ==========================================
-- POSTS TABLE
-- ==========================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

    type TEXT NOT NULL,             -- UPDATE, OFFER, EVENT, PRODUCT
    content TEXT NOT NULL,
    image_url TEXT,
    cta_type TEXT,                  -- LEARN_MORE, BOOK, ORDER, SHOP, SIGN_UP, CALL
    cta_url TEXT,
    offer_terms TEXT,
    event_start_date TIMESTAMPTZ,
    event_end_date TIMESTAMPTZ,

    scheduled_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    gbp_post_id TEXT,              -- Google's post ID after publishing
    status TEXT NOT NULL DEFAULT 'scheduled',  -- scheduled, publishing, published, failed
    error_message TEXT,
    retry_count INT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_business_scheduled ON posts(business_id, scheduled_at);
CREATE INDEX idx_posts_status_scheduled ON posts(status, scheduled_at);

-- ==========================================
-- REVIEWS TABLE
-- ==========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

    gbp_review_id TEXT UNIQUE NOT NULL,  -- Google's review ID
    reviewer_name TEXT NOT NULL,
    reviewer_photo_url TEXT,
    rating INT NOT NULL,                  -- 1-5
    comment TEXT,
    review_date TIMESTAMPTZ NOT NULL,

    -- Response
    ai_generated_reply TEXT,
    posted_reply TEXT,
    replied_at TIMESTAMPTZ,
    reply_status TEXT NOT NULL DEFAULT 'pending',  -- pending, ai_generated, posted

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_reply_status ON reviews(reply_status);

-- ==========================================
-- AUDITS TABLE
-- ==========================================
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    business_name TEXT NOT NULL,
    email TEXT,
    overall_score INT NOT NULL,       -- 0-100
    profile_complete INT NOT NULL,    -- 0-35
    content_activity INT NOT NULL,    -- 0-35
    engagement INT NOT NULL,          -- 0-30
    issues JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audits_user_id ON audits(user_id);

-- ==========================================
-- PAYMENTS TABLE
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_subscription_id TEXT,
    razorpay_signature TEXT,

    amount INT NOT NULL,               -- Amount in paise
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created',  -- created, authorized, captured, refunded, failed
    plan_type TEXT NOT NULL,           -- starter, pro, lifetime
    method TEXT,                       -- card, netbanking, wallet, upi
    email TEXT,
    contact TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);

-- ==========================================
-- AI USAGE TABLE
-- ==========================================
CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    action_type TEXT NOT NULL,         -- review_response, post_generation, audit_analysis
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    input_tokens INT NOT NULL DEFAULT 0,
    output_tokens INT NOT NULL DEFAULT 0,
    cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at);
