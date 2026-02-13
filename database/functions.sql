-- ==========================================
-- GBP Pro - Database Functions & Triggers
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ==========================================

-- ==========================================
-- AUTO-UPDATE updated_at TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- CREATE USER PROFILE ON SIGNUP
-- ==========================================
-- Automatically creates a user profile when a new auth user signs up

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- GET USER SUBSCRIPTION INFO
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id UUID)
RETURNS TABLE (
    subscription_tier TEXT,
    subscription_status TEXT,
    subscription_end_date TIMESTAMPTZ,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.subscription_tier,
        u.subscription_status,
        u.subscription_end_date,
        (u.subscription_status = 'active' AND
         (u.subscription_end_date IS NULL OR u.subscription_end_date > NOW())
        ) AS is_active
    FROM users u
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- GET USER DASHBOARD STATS
-- ==========================================

CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'scheduled_posts', (
            SELECT COUNT(*) FROM posts p
            JOIN businesses b ON p.business_id = b.id
            WHERE b.user_id = p_user_id AND p.status = 'scheduled'
        ),
        'published_posts', (
            SELECT COUNT(*) FROM posts p
            JOIN businesses b ON p.business_id = b.id
            WHERE b.user_id = p_user_id AND p.status = 'published'
        ),
        'total_reviews', (
            SELECT COUNT(*) FROM reviews r
            JOIN businesses b ON r.business_id = b.id
            WHERE b.user_id = p_user_id
        ),
        'pending_reviews', (
            SELECT COUNT(*) FROM reviews r
            JOIN businesses b ON r.business_id = b.id
            WHERE b.user_id = p_user_id AND r.reply_status = 'pending'
        ),
        'avg_rating', (
            SELECT COALESCE(AVG(r.rating), 0) FROM reviews r
            JOIN businesses b ON r.business_id = b.id
            WHERE b.user_id = p_user_id
        ),
        'latest_audit_score', (
            SELECT overall_score FROM audits
            WHERE user_id = p_user_id
            ORDER BY created_at DESC
            LIMIT 1
        ),
        'ai_credits_used', (
            SELECT COUNT(*) FROM ai_usage
            WHERE user_id = p_user_id
            AND created_at >= date_trunc('month', NOW())
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
