-- ==========================================
-- GBP Pro - Seed Data (Development Only)
-- Run this AFTER schema.sql and functions.sql
-- ==========================================

-- NOTE: In production, users are created via Supabase Auth.
-- This seed data is for local development and testing only.
-- The user ID below should match a Supabase Auth user you create manually.

-- Example: Insert a test user (replace the UUID with your actual auth user ID)
-- INSERT INTO users (id, email, name, subscription_tier, subscription_status)
-- VALUES (
--     'your-auth-user-uuid-here',
--     'test@example.com',
--     'Test User',
--     'pro',
--     'active'
-- );

-- Example: Insert a test business
-- INSERT INTO businesses (user_id, gbp_location_id, name, address, phone, category)
-- VALUES (
--     'your-auth-user-uuid-here',
--     'locations/123456789',
--     'Test Restaurant',
--     '123 MG Road, Bangalore, Karnataka 560001',
--     '+91 98765 43210',
--     'Restaurant'
-- );
