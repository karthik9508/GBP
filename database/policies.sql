-- ==========================================
-- GBP Pro - Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- USERS POLICIES
-- ==========================================

-- Users can read their own profile
CREATE POLICY "users_select_own"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow insert during signup (service role handles this)
CREATE POLICY "users_insert_own"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ==========================================
-- BUSINESSES POLICIES
-- ==========================================

-- Users can view their own businesses
CREATE POLICY "businesses_select_own"
    ON businesses FOR SELECT
    USING (user_id = auth.uid());

-- Users can create businesses for themselves
CREATE POLICY "businesses_insert_own"
    ON businesses FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own businesses
CREATE POLICY "businesses_update_own"
    ON businesses FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own businesses
CREATE POLICY "businesses_delete_own"
    ON businesses FOR DELETE
    USING (user_id = auth.uid());

-- ==========================================
-- POSTS POLICIES
-- ==========================================

-- Users can view posts for their businesses
CREATE POLICY "posts_select_own"
    ON posts FOR SELECT
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Users can create posts for their businesses
CREATE POLICY "posts_insert_own"
    ON posts FOR INSERT
    WITH CHECK (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Users can update their own posts
CREATE POLICY "posts_update_own"
    ON posts FOR UPDATE
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Users can delete their own posts
CREATE POLICY "posts_delete_own"
    ON posts FOR DELETE
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- ==========================================
-- REVIEWS POLICIES
-- ==========================================

-- Users can view reviews for their businesses
CREATE POLICY "reviews_select_own"
    ON reviews FOR SELECT
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Users can update reviews (for posting replies)
CREATE POLICY "reviews_update_own"
    ON reviews FOR UPDATE
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- ==========================================
-- AUDITS POLICIES
-- ==========================================

-- Users can view their own audits
CREATE POLICY "audits_select_own"
    ON audits FOR SELECT
    USING (user_id = auth.uid());

-- Anyone can insert an audit (free tool, no login required)
CREATE POLICY "audits_insert_any"
    ON audits FOR INSERT
    WITH CHECK (true);

-- ==========================================
-- PAYMENTS POLICIES
-- ==========================================

-- Users can view their own payments
CREATE POLICY "payments_select_own"
    ON payments FOR SELECT
    USING (user_id = auth.uid());

-- ==========================================
-- AI USAGE POLICIES
-- ==========================================

-- Users can view their own AI usage
CREATE POLICY "ai_usage_select_own"
    ON ai_usage FOR SELECT
    USING (user_id = auth.uid());
