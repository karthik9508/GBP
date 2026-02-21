-- ==========================================
-- SCHEDULED POSTS TABLE
-- ==========================================
-- Run this in Supabase SQL Editor
-- User-level scheduled posts (not linked to GBP business yet)

CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type TEXT NOT NULL DEFAULT 'UPDATE',      -- UPDATE, OFFER, EVENT, PRODUCT
    content TEXT NOT NULL,
    image_url TEXT,
    business_name TEXT,                        -- optional, for display

    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',  -- scheduled, published, failed
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status, scheduled_at);

-- RLS policies
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY scheduled_posts_select ON scheduled_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY scheduled_posts_insert ON scheduled_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY scheduled_posts_update ON scheduled_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY scheduled_posts_delete ON scheduled_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for post images (run once)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
-- ON CONFLICT (id) DO NOTHING;
