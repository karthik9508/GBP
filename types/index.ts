// ==========================================
// Global TypeScript Types for GBP Pro
// ==========================================

export type SubscriptionTier = "free" | "starter" | "pro" | "lifetime";
export type SubscriptionStatus = "active" | "inactive" | "cancelled" | "past_due";

export type PostType = "UPDATE" | "OFFER" | "EVENT" | "PRODUCT";
export type PostStatus = "scheduled" | "publishing" | "published" | "failed";

export type ReviewReplyStatus = "pending" | "ai_generated" | "posted";
export type ReviewTone = "professional" | "friendly" | "apologetic";

export type PaymentStatus = "created" | "captured" | "failed" | "refunded";

export interface AuditIssue {
    category: "profile" | "content" | "engagement";
    severity: "low" | "medium" | "high";
    message: string;
    recommendation: string;
}

export interface AuditResult {
    score: number;
    profileComplete: number;
    contentActivity: number;
    engagement: number;
    issues: AuditIssue[];
    recommendations: string[];
}

export interface PricingPlan {
    id: string;
    name: string;
    price: number; // in paise
    period: string;
    features: string[];
    highlighted?: boolean;
    ctaText: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Razorpay types
export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export interface RazorpayPaymentVerification {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
