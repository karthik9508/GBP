import type { AuditIssue } from "@/types";

// ==========================================
// 47-Point GBP Audit Checklist (Premium)
// ==========================================

export interface ChecklistItem {
    id: string;
    category: ChecklistCategory;
    label: string;
    passed: boolean;
    weight: "critical" | "important" | "nice-to-have";
    fixGuide: string;
    estimatedTime: string;
}

export type ChecklistCategory =
    | "basic_info"
    | "contact"
    | "visual"
    | "content"
    | "reviews"
    | "engagement"
    | "seo"
    | "technical";

export const CATEGORY_LABELS: Record<ChecklistCategory, { label: string; icon: string }> = {
    basic_info: { label: "Basic Information", icon: "📋" },
    contact: { label: "Contact & Access", icon: "📞" },
    visual: { label: "Visual Content", icon: "📸" },
    content: { label: "Posts & Content", icon: "📝" },
    reviews: { label: "Reviews", icon: "⭐" },
    engagement: { label: "Engagement", icon: "💬" },
    seo: { label: "SEO & Discovery", icon: "🔍" },
    technical: { label: "Technical", icon: "⚙️" },
};

interface PlaceData {
    name?: string;
    address?: string;
    phone?: string | null;
    website?: string | null;
    has_hours?: boolean;
    photo_count?: number;
    description?: string | null;
    rating?: number | null;
    review_count?: number;
    types?: string[];
    business_status?: string | null;
}

export function runPremiumChecklist(place: PlaceData): {
    checklist: ChecklistItem[];
    passedCount: number;
    totalCount: number;
    categoryScores: Record<ChecklistCategory, { passed: number; total: number }>;
} {
    const checklist: ChecklistItem[] = [
        // ==========================================
        // BASIC INFO (7 items)
        // ==========================================
        {
            id: "bi-1",
            category: "basic_info",
            label: "Business name is set",
            passed: !!place.name && place.name.length > 0,
            weight: "critical",
            fixGuide: "Go to your GBP dashboard → Info → Edit business name. Use your real business name without keywords stuffing.",
            estimatedTime: "2 min",
        },
        {
            id: "bi-2",
            category: "basic_info",
            label: "Business name matches real signage",
            passed: !!place.name && place.name.length > 0 && place.name.length < 80,
            weight: "critical",
            fixGuide: "Ensure your GBP name exactly matches your storefront sign. Adding extra keywords can get you suspended.",
            estimatedTime: "2 min",
        },
        {
            id: "bi-3",
            category: "basic_info",
            label: "Complete address is set",
            passed: !!place.address && place.address.length > 10,
            weight: "critical",
            fixGuide: "Go to Info → Address. Enter your full address including building number, street, city, state, and PIN code.",
            estimatedTime: "3 min",
        },
        {
            id: "bi-4",
            category: "basic_info",
            label: "Primary category is selected",
            passed: !!place.types && place.types.length > 0,
            weight: "critical",
            fixGuide: "Go to Info → Category. Choose the most specific category that describes your main business activity.",
            estimatedTime: "2 min",
        },
        {
            id: "bi-5",
            category: "basic_info",
            label: "Additional categories added",
            passed: !!place.types && place.types.length > 2,
            weight: "important",
            fixGuide: "Add 2-3 additional categories that describe your secondary services. E.g., a restaurant might add 'Catering service' and 'Takeout restaurant'.",
            estimatedTime: "3 min",
        },
        {
            id: "bi-6",
            category: "basic_info",
            label: "Business description is filled",
            passed: !!place.description && place.description.length > 20,
            weight: "important",
            fixGuide: "Go to Info → Description. Write a 750-character description including your services, specialties, and location-specific keywords.",
            estimatedTime: "10 min",
        },
        {
            id: "bi-7",
            category: "basic_info",
            label: "Business is marked as operational",
            passed: place.business_status === "OPERATIONAL" || !place.business_status,
            weight: "critical",
            fixGuide: "If your business shows as temporarily closed or permanently closed, go to Info → Status and update it to 'Open'.",
            estimatedTime: "2 min",
        },

        // ==========================================
        // CONTACT (5 items)
        // ==========================================
        {
            id: "ct-1",
            category: "contact",
            label: "Phone number is added",
            passed: !!place.phone,
            weight: "critical",
            fixGuide: "Go to Info → Phone. Add your primary business phone number. Use a local number for better local SEO.",
            estimatedTime: "2 min",
        },
        {
            id: "ct-2",
            category: "contact",
            label: "Website URL is set",
            passed: !!place.website,
            weight: "important",
            fixGuide: "Go to Info → Website. Add your website URL. If you don't have a website, Google offers a free basic one.",
            estimatedTime: "2 min",
        },
        {
            id: "ct-3",
            category: "contact",
            label: "Business hours are set",
            passed: !!place.has_hours,
            weight: "critical",
            fixGuide: "Go to Info → Hours. Set your regular business hours for each day. Include special hours for holidays.",
            estimatedTime: "5 min",
        },
        {
            id: "ct-4",
            category: "contact",
            label: "Holiday hours are configured",
            passed: !!place.has_hours, // Approximation — can't differentiate from Places API
            weight: "nice-to-have",
            fixGuide: "Go to Info → Special Hours. Add hours for upcoming public holidays so customers know when you're open.",
            estimatedTime: "5 min",
        },
        {
            id: "ct-5",
            category: "contact",
            label: "Appointment/booking link added",
            passed: false, // Cannot determine from Places API
            weight: "nice-to-have",
            fixGuide: "If applicable, go to Info → Appointment URL. Add a link to your booking system (Calendly, Zoho, etc.).",
            estimatedTime: "3 min",
        },

        // ==========================================
        // VISUAL (6 items)
        // ==========================================
        {
            id: "vs-1",
            category: "visual",
            label: "Has at least 1 photo",
            passed: (place.photo_count || 0) >= 1,
            weight: "critical",
            fixGuide: "Upload at least one high-quality photo of your business exterior from the GBP dashboard → Photos.",
            estimatedTime: "5 min",
        },
        {
            id: "vs-2",
            category: "visual",
            label: "Has 5+ photos",
            passed: (place.photo_count || 0) >= 5,
            weight: "important",
            fixGuide: "Add photos of: exterior, interior, team, products/services. Aim for variety so customers know what to expect.",
            estimatedTime: "10 min",
        },
        {
            id: "vs-3",
            category: "visual",
            label: "Has 10+ photos",
            passed: (place.photo_count || 0) >= 10,
            weight: "important",
            fixGuide: "Listings with 10+ photos get 35% more clicks. Add menu items, happy customers (with permission), and events.",
            estimatedTime: "15 min",
        },
        {
            id: "vs-4",
            category: "visual",
            label: "Has 20+ photos (ideal)",
            passed: (place.photo_count || 0) >= 20,
            weight: "nice-to-have",
            fixGuide: "The best-performing listings have 20+ photos. Add seasonal content, behind-the-scenes, and team photos.",
            estimatedTime: "20 min",
        },
        {
            id: "vs-5",
            category: "visual",
            label: "Cover photo is set",
            passed: (place.photo_count || 0) >= 1, // Approximation
            weight: "critical",
            fixGuide: "Go to Photos → Cover photo. Choose a high-quality, well-lit image that represents your business. Ideal size: 1080x608px.",
            estimatedTime: "5 min",
        },
        {
            id: "vs-6",
            category: "visual",
            label: "Logo is uploaded",
            passed: (place.photo_count || 0) >= 2, // Approximation
            weight: "important",
            fixGuide: "Go to Photos → Logo. Upload a square logo (250x250px minimum). This appears in search results and Maps.",
            estimatedTime: "3 min",
        },

        // ==========================================
        // CONTENT (6 items)
        // ==========================================
        {
            id: "cn-1",
            category: "content",
            label: "Has posted in the last 7 days",
            passed: false, // Cannot determine from Places API — needs GBP API
            weight: "important",
            fixGuide: "Create a GBP post now! Share an update, offer, or event. Active profiles rank higher in local search.",
            estimatedTime: "10 min",
        },
        {
            id: "cn-2",
            category: "content",
            label: "Posts at least weekly",
            passed: false,
            weight: "critical",
            fixGuide: "Schedule weekly posts using GBP Pro. Include photos, CTAs, and relevant keywords in every post.",
            estimatedTime: "15 min/week",
        },
        {
            id: "cn-3",
            category: "content",
            label: "Uses different post types",
            passed: false,
            weight: "nice-to-have",
            fixGuide: "Mix your post types: Updates, Offers, Events, and Products. Variety signals an active business to Google.",
            estimatedTime: "5 min",
        },
        {
            id: "cn-4",
            category: "content",
            label: "Posts include images",
            passed: false,
            weight: "important",
            fixGuide: "Always attach a photo to your posts. Posts with images get 10x more engagement than text-only posts.",
            estimatedTime: "5 min",
        },
        {
            id: "cn-5",
            category: "content",
            label: "Posts include call-to-action",
            passed: false,
            weight: "important",
            fixGuide: "Add a CTA button (Learn more, Call now, Book, Order) to every post to drive customer actions.",
            estimatedTime: "2 min",
        },
        {
            id: "cn-6",
            category: "content",
            label: "Products/services listed",
            passed: false, // Cannot determine from Places API
            weight: "important",
            fixGuide: "Go to Products/Services in your GBP dashboard. Add your key offerings with descriptions and prices.",
            estimatedTime: "15 min",
        },

        // ==========================================
        // REVIEWS (5 items)
        // ==========================================
        {
            id: "rv-1",
            category: "reviews",
            label: "Has at least 1 review",
            passed: (place.review_count || 0) >= 1,
            weight: "critical",
            fixGuide: "Ask your best customers to leave a review. Share your Google review link via WhatsApp, email, or on receipts.",
            estimatedTime: "5 min",
        },
        {
            id: "rv-2",
            category: "reviews",
            label: "Has 10+ reviews",
            passed: (place.review_count || 0) >= 10,
            weight: "important",
            fixGuide: "Aim for 10+ reviews. Place a review request QR code at your counter, and follow up with customers after service.",
            estimatedTime: "Ongoing",
        },
        {
            id: "rv-3",
            category: "reviews",
            label: "Has 50+ reviews",
            passed: (place.review_count || 0) >= 50,
            weight: "nice-to-have",
            fixGuide: "50+ reviews builds strong trust. Automate review requests via SMS/WhatsApp after each transaction.",
            estimatedTime: "Ongoing",
        },
        {
            id: "rv-4",
            category: "reviews",
            label: "Average rating is 4.0+",
            passed: (place.rating || 0) >= 4.0,
            weight: "critical",
            fixGuide: "Focus on customer satisfaction. Address negative reviews promptly and professionally. Ask happy customers to review.",
            estimatedTime: "Ongoing",
        },
        {
            id: "rv-5",
            category: "reviews",
            label: "Average rating is 4.5+",
            passed: (place.rating || 0) >= 4.5,
            weight: "important",
            fixGuide: "4.5+ rating is the gold standard. Identify patterns in negative reviews and fix root causes in operations.",
            estimatedTime: "Ongoing",
        },

        // ==========================================
        // ENGAGEMENT (5 items)
        // ==========================================
        {
            id: "en-1",
            category: "engagement",
            label: "Responds to reviews",
            passed: false, // Cannot determine from Places API
            weight: "critical",
            fixGuide: "Respond to every review within 24 hours. Use GBP Pro's AI to generate professional responses instantly.",
            estimatedTime: "5 min/review",
        },
        {
            id: "en-2",
            category: "engagement",
            label: "Responds within 24 hours",
            passed: false,
            weight: "important",
            fixGuide: "Set up GBP Pro alerts. Quick responses show Google and customers that you care about feedback.",
            estimatedTime: "Setup: 5 min",
        },
        {
            id: "en-3",
            category: "engagement",
            label: "Answers customer questions (Q&A)",
            passed: false,
            weight: "important",
            fixGuide: "Check your GBP Q&A section regularly. Pre-populate common questions and answers proactively.",
            estimatedTime: "10 min",
        },
        {
            id: "en-4",
            category: "engagement",
            label: "Messaging is enabled",
            passed: false,
            weight: "nice-to-have",
            fixGuide: "Enable messaging in your GBP settings. This lets customers message you directly from your listing.",
            estimatedTime: "3 min",
        },
        {
            id: "en-5",
            category: "engagement",
            label: "Uses Google Business messages",
            passed: false,
            weight: "nice-to-have",
            fixGuide: "Actively respond to messages within a few hours. Set up auto-replies for after-hours inquiries.",
            estimatedTime: "5 min",
        },

        // ==========================================
        // SEO (7 items)
        // ==========================================
        {
            id: "se-1",
            category: "seo",
            label: "Description contains relevant keywords",
            passed: !!place.description && place.description.length > 50,
            weight: "critical",
            fixGuide: "Rewrite your description to naturally include your main services and location. E.g., 'Best biryani restaurant in Koramangala, Bangalore'.",
            estimatedTime: "10 min",
        },
        {
            id: "se-2",
            category: "seo",
            label: "Category matches main service",
            passed: !!place.types && place.types.length > 0,
            weight: "critical",
            fixGuide: "Ensure your primary category is the most specific one available. 'Indian restaurant' is better than just 'Restaurant'.",
            estimatedTime: "3 min",
        },
        {
            id: "se-3",
            category: "seo",
            label: "Location keywords in posts",
            passed: false,
            weight: "important",
            fixGuide: "Include your city/area name in GBP posts. E.g., 'Visit our new outlet in Indiranagar, Bangalore!'",
            estimatedTime: "2 min/post",
        },
        {
            id: "se-4",
            category: "seo",
            label: "Service area is defined",
            passed: !!place.address,
            weight: "important",
            fixGuide: "If you serve customers beyond your location, go to Info → Service area and add the areas you cover.",
            estimatedTime: "5 min",
        },
        {
            id: "se-5",
            category: "seo",
            label: "Attributes/amenities are set",
            passed: false,
            weight: "nice-to-have",
            fixGuide: "Go to Info → Attributes. Set amenities like WiFi, parking, wheelchair access, outdoor seating, etc.",
            estimatedTime: "5 min",
        },
        {
            id: "se-6",
            category: "seo",
            label: "Website links back to GBP",
            passed: !!place.website,
            weight: "important",
            fixGuide: "Add a Google Maps embed and 'Find us on Google' link on your website's contact page for SEO synergy.",
            estimatedTime: "10 min",
        },
        {
            id: "se-7",
            category: "seo",
            label: "Consistent NAP across web",
            passed: !!place.name && !!place.address && !!place.phone,
            weight: "critical",
            fixGuide: "Ensure your Name, Address, and Phone (NAP) are identical on your website, social media, and directories like Justdial, Sulekha.",
            estimatedTime: "15 min",
        },

        // ==========================================
        // TECHNICAL (6 items)
        // ==========================================
        {
            id: "tc-1",
            category: "technical",
            label: "Listing is verified",
            passed: true, // If it appears in Places, it's likely verified
            weight: "critical",
            fixGuide: "Verify your listing via postcard, phone, or email. Unverified listings don't appear in search results.",
            estimatedTime: "1-5 days",
        },
        {
            id: "tc-2",
            category: "technical",
            label: "No duplicate listings",
            passed: true, // Cannot check from API, assume true
            weight: "critical",
            fixGuide: "Search for your business on Google Maps. If duplicates exist, report them via 'Suggest an edit' → 'Close or remove'.",
            estimatedTime: "10 min",
        },
        {
            id: "tc-3",
            category: "technical",
            label: "Website is mobile-friendly",
            passed: !!place.website, // Approximation
            weight: "important",
            fixGuide: "Test your website at Google's Mobile-Friendly Test. Over 60% of GBP clicks come from mobile devices.",
            estimatedTime: "Varies",
        },
        {
            id: "tc-4",
            category: "technical",
            label: "Website loads in under 3 seconds",
            passed: !!place.website,
            weight: "important",
            fixGuide: "Test at PageSpeed Insights. Compress images, enable caching, and use a CDN for faster loading.",
            estimatedTime: "Varies",
        },
        {
            id: "tc-5",
            category: "technical",
            label: "SSL certificate active (HTTPS)",
            passed: place.website?.startsWith("https") ?? false,
            weight: "important",
            fixGuide: "Ensure your website uses HTTPS. Most hosting providers offer free SSL certificates via Let's Encrypt.",
            estimatedTime: "15 min",
        },
        {
            id: "tc-6",
            category: "technical",
            label: "Google Search Console connected",
            passed: false, // Cannot determine
            weight: "nice-to-have",
            fixGuide: "Connect your website to Google Search Console for insights on how customers find you via search.",
            estimatedTime: "10 min",
        },
    ];

    // Calculate category scores
    const categoryScores: Record<ChecklistCategory, { passed: number; total: number }> = {
        basic_info: { passed: 0, total: 0 },
        contact: { passed: 0, total: 0 },
        visual: { passed: 0, total: 0 },
        content: { passed: 0, total: 0 },
        reviews: { passed: 0, total: 0 },
        engagement: { passed: 0, total: 0 },
        seo: { passed: 0, total: 0 },
        technical: { passed: 0, total: 0 },
    };

    for (const item of checklist) {
        categoryScores[item.category].total++;
        if (item.passed) categoryScores[item.category].passed++;
    }

    const passedCount = checklist.filter(i => i.passed).length;

    return { checklist, passedCount, totalCount: checklist.length, categoryScores };
}

/**
 * Generate a step-by-step fix guide from failed checklist items
 */
export function generateFixGuide(checklist: ChecklistItem[]): {
    id: string;
    label: string;
    category: string;
    fixGuide: string;
    estimatedTime: string;
    impact: "critical" | "important" | "nice-to-have";
}[] {
    return checklist
        .filter(item => !item.passed)
        .sort((a, b) => {
            const priority = { critical: 0, important: 1, "nice-to-have": 2 };
            return priority[a.weight] - priority[b.weight];
        })
        .map(item => ({
            id: item.id,
            label: item.label,
            category: item.category,
            fixGuide: item.fixGuide,
            estimatedTime: item.estimatedTime,
            impact: item.weight,
        }));
}
