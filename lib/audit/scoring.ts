import type { AuditIssue } from "@/types";

interface ScoringInput {
    businessName: string;
    hasAddress: boolean;
    hasPhone: boolean;
    hasWebsite: boolean;
    hasCategory: boolean;
    hasDescription: boolean;
    hasPhotos: boolean;
    photoCount: number;
    hasBusinessHours: boolean;
    recentPostCount: number;
    totalReviews: number;
    averageRating: number;
    responseRate: number;
}

export function calculateAuditScore(input: Partial<ScoringInput>): {
    score: number;
    profileComplete: number;
    contentActivity: number;
    engagement: number;
    issues: AuditIssue[];
} {
    let profileComplete = 0;
    let contentActivity = 0;
    let engagement = 0;
    const issues: AuditIssue[] = [];

    // ==========================================
    // PROFILE COMPLETENESS (max 35)
    // ==========================================

    if (input.businessName) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "high",
        message: "Business name is missing",
        recommendation: "Add a clear, accurate business name",
    });

    if (input.hasAddress) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "high",
        message: "Business address is missing",
        recommendation: "Add your complete business address for local SEO",
    });

    if (input.hasPhone) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "medium",
        message: "Phone number is missing",
        recommendation: "Add a phone number so customers can contact you",
    });

    if (input.hasWebsite) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "medium",
        message: "Website URL is missing",
        recommendation: "Add your website to drive traffic from Google",
    });

    if (input.hasCategory) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "high",
        message: "Business category is not set",
        recommendation: "Set a primary category to appear in relevant searches",
    });

    if (input.hasDescription) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "medium",
        message: "Business description is missing",
        recommendation: "Add a 750-character description with relevant keywords",
    });

    if (input.hasBusinessHours) profileComplete += 5;
    else issues.push({
        category: "profile",
        severity: "medium",
        message: "Business hours are not set",
        recommendation: "Add business hours so customers know when you're open",
    });

    // ==========================================
    // CONTENT ACTIVITY (max 35)
    // ==========================================

    const postCount = input.recentPostCount ?? 0;
    if (postCount >= 12) contentActivity += 15;
    else if (postCount >= 8) contentActivity += 12;
    else if (postCount >= 4) contentActivity += 8;
    else if (postCount >= 1) contentActivity += 4;
    else issues.push({
        category: "content",
        severity: "high",
        message: "No posts in the last 30 days",
        recommendation: "Post at least 3-4 times per month to stay active",
    });

    const photoCount = input.photoCount ?? 0;
    if (photoCount >= 20) contentActivity += 10;
    else if (photoCount >= 10) contentActivity += 8;
    else if (photoCount >= 5) contentActivity += 5;
    else if (photoCount >= 1) contentActivity += 2;
    else issues.push({
        category: "content",
        severity: "medium",
        message: "No photos on your profile",
        recommendation: "Add at least 10 high-quality photos of your business",
    });

    if (input.hasPhotos) contentActivity += 10;
    else contentActivity += 0;

    // ==========================================
    // ENGAGEMENT (max 30)
    // ==========================================

    const totalReviews = input.totalReviews ?? 0;
    if (totalReviews >= 50) engagement += 10;
    else if (totalReviews >= 20) engagement += 8;
    else if (totalReviews >= 10) engagement += 5;
    else if (totalReviews >= 1) engagement += 3;
    else issues.push({
        category: "engagement",
        severity: "medium",
        message: "Very few or no reviews",
        recommendation: "Encourage happy customers to leave reviews",
    });

    const avgRating = input.averageRating ?? 0;
    if (avgRating >= 4.5) engagement += 10;
    else if (avgRating >= 4.0) engagement += 8;
    else if (avgRating >= 3.5) engagement += 5;
    else if (avgRating > 0) {
        engagement += 2;
        issues.push({
            category: "engagement",
            severity: "high",
            message: `Average rating is ${avgRating.toFixed(1)} — below 4.0`,
            recommendation: "Focus on service quality and respond professionally to negative reviews",
        });
    }

    const responseRate = input.responseRate ?? 0;
    if (responseRate >= 90) engagement += 10;
    else if (responseRate >= 70) engagement += 7;
    else if (responseRate >= 40) engagement += 4;
    else issues.push({
        category: "engagement",
        severity: "high",
        message: `Review response rate is only ${responseRate}%`,
        recommendation: "Respond to all reviews within 24 hours — GBP Pro can help with AI responses!",
    });

    const score = profileComplete + contentActivity + engagement;

    return { score, profileComplete, contentActivity, engagement, issues };
}

/**
 * Generate a demo/mock audit result for when we don't have real GBP API access
 */
export function generateMockAuditResult(businessName: string) {
    // Simulate a somewhat realistic score
    const profileComplete = Math.floor(Math.random() * 15) + 18; // 18-33
    const contentActivity = Math.floor(Math.random() * 15) + 10; // 10-25
    const engagement = Math.floor(Math.random() * 12) + 10; // 10-22
    const score = profileComplete + contentActivity + engagement;

    const issues: AuditIssue[] = [];

    if (profileComplete < 30) {
        issues.push({
            category: "profile",
            severity: "medium",
            message: "Business description could be more detailed",
            recommendation: "Write a 750-character description with relevant keywords for " + businessName,
        });
    }

    if (contentActivity < 20) {
        issues.push({
            category: "content",
            severity: "high",
            message: "No posts in the last 30 days",
            recommendation: "Post at least 3-4 times per month. GBP Pro can schedule posts automatically!",
        });
        issues.push({
            category: "content",
            severity: "medium",
            message: "Only a few photos on your profile",
            recommendation: "Add at least 10 high-quality photos of your business, products, and team",
        });
    }

    if (engagement < 18) {
        issues.push({
            category: "engagement",
            severity: "high",
            message: "Review response rate is below 50%",
            recommendation: "Respond to all reviews within 24 hours. Use GBP Pro's AI to generate professional responses!",
        });
        issues.push({
            category: "engagement",
            severity: "medium",
            message: "Could benefit from more customer reviews",
            recommendation: "Add a Google Review link to your receipts, emails, and WhatsApp messages",
        });
    }

    return {
        score,
        profileComplete,
        contentActivity,
        engagement,
        issues,
        recommendations: [
            "Complete your business description with relevant keywords",
            "Post at least 3 times per week on GBP",
            "Respond to all reviews within 24 hours",
            "Add more high-quality photos",
            "Use GBP Pro to automate your posting schedule",
        ],
    };
}
