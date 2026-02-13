// ==========================================
// GBP Pro - Supabase Database Types
// ==========================================
// This file provides type-safety for Supabase queries.
// To auto-generate from your live database, run:
//   npx supabase gen types typescript --linked > lib/supabase/types.ts
// ==========================================

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    google_id: string | null;
                    password_hash: string | null;
                    avatar_url: string | null;
                    subscription_tier: string;
                    razorpay_customer_id: string | null;
                    razorpay_subscription_id: string | null;
                    subscription_status: string;
                    subscription_end_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    name?: string | null;
                    google_id?: string | null;
                    password_hash?: string | null;
                    avatar_url?: string | null;
                    subscription_tier?: string;
                    razorpay_customer_id?: string | null;
                    razorpay_subscription_id?: string | null;
                    subscription_status?: string;
                    subscription_end_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string | null;
                    google_id?: string | null;
                    password_hash?: string | null;
                    avatar_url?: string | null;
                    subscription_tier?: string;
                    razorpay_customer_id?: string | null;
                    razorpay_subscription_id?: string | null;
                    subscription_status?: string;
                    subscription_end_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            businesses: {
                Row: {
                    id: string;
                    user_id: string;
                    gbp_location_id: string;
                    name: string;
                    address: string | null;
                    phone: string | null;
                    category: string | null;
                    website_url: string | null;
                    timezone: string;
                    access_token: string | null;
                    refresh_token: string | null;
                    token_expires_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    gbp_location_id: string;
                    name: string;
                    address?: string | null;
                    phone?: string | null;
                    category?: string | null;
                    website_url?: string | null;
                    timezone?: string;
                    access_token?: string | null;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    gbp_location_id?: string;
                    name?: string;
                    address?: string | null;
                    phone?: string | null;
                    category?: string | null;
                    website_url?: string | null;
                    timezone?: string;
                    access_token?: string | null;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "businesses_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
            posts: {
                Row: {
                    id: string;
                    business_id: string;
                    type: string;
                    content: string;
                    image_url: string | null;
                    cta_type: string | null;
                    cta_url: string | null;
                    offer_terms: string | null;
                    event_start_date: string | null;
                    event_end_date: string | null;
                    scheduled_at: string;
                    published_at: string | null;
                    gbp_post_id: string | null;
                    status: string;
                    error_message: string | null;
                    retry_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    business_id: string;
                    type: string;
                    content: string;
                    image_url?: string | null;
                    cta_type?: string | null;
                    cta_url?: string | null;
                    offer_terms?: string | null;
                    event_start_date?: string | null;
                    event_end_date?: string | null;
                    scheduled_at: string;
                    published_at?: string | null;
                    gbp_post_id?: string | null;
                    status?: string;
                    error_message?: string | null;
                    retry_count?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    business_id?: string;
                    type?: string;
                    content?: string;
                    image_url?: string | null;
                    cta_type?: string | null;
                    cta_url?: string | null;
                    offer_terms?: string | null;
                    event_start_date?: string | null;
                    event_end_date?: string | null;
                    scheduled_at?: string;
                    published_at?: string | null;
                    gbp_post_id?: string | null;
                    status?: string;
                    error_message?: string | null;
                    retry_count?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_business_id_fkey";
                        columns: ["business_id"];
                        isOneToOne: false;
                        referencedRelation: "businesses";
                        referencedColumns: ["id"];
                    },
                ];
            };
            reviews: {
                Row: {
                    id: string;
                    business_id: string;
                    gbp_review_id: string;
                    reviewer_name: string;
                    reviewer_photo_url: string | null;
                    rating: number;
                    comment: string | null;
                    review_date: string;
                    ai_generated_reply: string | null;
                    posted_reply: string | null;
                    replied_at: string | null;
                    reply_status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    business_id: string;
                    gbp_review_id: string;
                    reviewer_name: string;
                    reviewer_photo_url?: string | null;
                    rating: number;
                    comment?: string | null;
                    review_date: string;
                    ai_generated_reply?: string | null;
                    posted_reply?: string | null;
                    replied_at?: string | null;
                    reply_status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    business_id?: string;
                    gbp_review_id?: string;
                    reviewer_name?: string;
                    reviewer_photo_url?: string | null;
                    rating?: number;
                    comment?: string | null;
                    review_date?: string;
                    ai_generated_reply?: string | null;
                    posted_reply?: string | null;
                    replied_at?: string | null;
                    reply_status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "reviews_business_id_fkey";
                        columns: ["business_id"];
                        isOneToOne: false;
                        referencedRelation: "businesses";
                        referencedColumns: ["id"];
                    },
                ];
            };
            audits: {
                Row: {
                    id: string;
                    user_id: string | null;
                    business_name: string;
                    email: string | null;
                    overall_score: number;
                    profile_complete: number;
                    content_activity: number;
                    engagement: number;
                    issues: Json;
                    recommendations: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    business_name: string;
                    email?: string | null;
                    overall_score: number;
                    profile_complete: number;
                    content_activity: number;
                    engagement: number;
                    issues?: Json;
                    recommendations?: Json | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    business_name?: string;
                    email?: string | null;
                    overall_score?: number;
                    profile_complete?: number;
                    content_activity?: number;
                    engagement?: number;
                    issues?: Json;
                    recommendations?: Json | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "audits_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
            payments: {
                Row: {
                    id: string;
                    user_id: string;
                    razorpay_order_id: string;
                    razorpay_payment_id: string | null;
                    razorpay_subscription_id: string | null;
                    razorpay_signature: string | null;
                    amount: number;
                    currency: string;
                    status: string;
                    plan_type: string;
                    method: string | null;
                    email: string | null;
                    contact: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    razorpay_order_id: string;
                    razorpay_payment_id?: string | null;
                    razorpay_subscription_id?: string | null;
                    razorpay_signature?: string | null;
                    amount: number;
                    currency?: string;
                    status?: string;
                    plan_type: string;
                    method?: string | null;
                    email?: string | null;
                    contact?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    razorpay_order_id?: string;
                    razorpay_payment_id?: string | null;
                    razorpay_subscription_id?: string | null;
                    razorpay_signature?: string | null;
                    amount?: number;
                    currency?: string;
                    status?: string;
                    plan_type?: string;
                    method?: string | null;
                    email?: string | null;
                    contact?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "payments_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
            ai_usage: {
                Row: {
                    id: string;
                    user_id: string;
                    action_type: string;
                    model: string;
                    input_tokens: number;
                    output_tokens: number;
                    cost_usd: number;
                    metadata: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    action_type: string;
                    model?: string;
                    input_tokens?: number;
                    output_tokens?: number;
                    cost_usd?: number;
                    metadata?: Json | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    action_type?: string;
                    model?: string;
                    input_tokens?: number;
                    output_tokens?: number;
                    cost_usd?: number;
                    metadata?: Json | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "ai_usage_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            get_user_subscription: {
                Args: { p_user_id: string };
                Returns: {
                    subscription_tier: string;
                    subscription_status: string;
                    subscription_end_date: string | null;
                    is_active: boolean;
                }[];
            };
            get_dashboard_stats: {
                Args: { p_user_id: string };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

// Convenience type aliases
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];
