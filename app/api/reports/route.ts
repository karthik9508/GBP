import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

interface AuditRow {
    id: string;
    business_name: string;
    overall_score: number;
    profile_complete: number;
    content_activity: number;
    engagement: number;
    issues: unknown;
    recommendations: unknown;
    created_at: string;
}

// Improvement suggestions based on score areas
function getImprovements(audit: AuditRow) {
    const suggestions: { area: string; score: number; maxScore: number; priority: "high" | "medium" | "low"; tips: string[] }[] = [];

    // Profile completeness (max 35)
    const profilePct = (audit.profile_complete / 35) * 100;
    if (profilePct < 80) {
        suggestions.push({
            area: "Profile Completeness",
            score: audit.profile_complete,
            maxScore: 35,
            priority: profilePct < 50 ? "high" : "medium",
            tips: [
                "Add a detailed business description with relevant keywords",
                "Upload at least 10 high-quality photos of your business",
                "Ensure your business hours are accurate and up-to-date",
                "Add all relevant business categories (primary + secondary)",
                "Include your website URL and appointment links",
                "Add service areas if you serve customers at their location",
            ].slice(0, profilePct < 50 ? 6 : 3),
        });
    }

    // Content activity (max 35)
    const contentPct = (audit.content_activity / 35) * 100;
    if (contentPct < 80) {
        suggestions.push({
            area: "Content Activity",
            score: audit.content_activity,
            maxScore: 35,
            priority: contentPct < 50 ? "high" : "medium",
            tips: [
                "Post updates at least 2-3 times per week on your GBP",
                "Share photos of your work, products, or team regularly",
                "Create Google Offers to attract new customers",
                "Announce events or seasonal promotions",
                "Respond to questions in the Q&A section promptly",
                "Add new products or services to your profile",
            ].slice(0, contentPct < 50 ? 6 : 3),
        });
    }

    // Engagement (max 30)
    const engagementPct = (audit.engagement / 30) * 100;
    if (engagementPct < 80) {
        suggestions.push({
            area: "Customer Engagement",
            score: audit.engagement,
            maxScore: 30,
            priority: engagementPct < 50 ? "high" : "medium",
            tips: [
                "Respond to every review within 24 hours",
                "Thank customers for positive reviews with personalized messages",
                "Address negative reviews professionally and offer solutions",
                "Encourage happy customers to leave reviews",
                "Enable messaging and respond to inquiries quickly",
                "Use the Q&A feature to answer common questions proactively",
            ].slice(0, engagementPct < 50 ? 6 : 3),
        });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions;
}

function getOverallStatus(score: number): { label: string; description: string } {
    if (score >= 85) return { label: "Excellent", description: "Your GBP is well-optimized. Keep up the great work and maintain consistency!" };
    if (score >= 70) return { label: "Good", description: "Your GBP is in good shape but has room for improvement. Focus on the suggestions below." };
    if (score >= 50) return { label: "Needs Work", description: "Your GBP has several areas that need attention. Prioritize the high-priority items below." };
    return { label: "Critical", description: "Your GBP needs significant improvement. Start with the high-priority suggestions immediately." };
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const service = createServiceClient();

        // Fetch all audits for the user (for history)
        const { data: audits, error } = await service
            .from("audits")
            .select("id, business_name, overall_score, profile_complete, content_activity, engagement, issues, recommendations, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            console.error("Fetch audits error:", error);
            return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
        }

        if (!audits || audits.length === 0) {
            return NextResponse.json({
                hasData: false,
                message: "No audit reports yet. Run your first audit to see improvement suggestions.",
            });
        }

        const latest = audits[0] as AuditRow;
        const previous = audits.length > 1 ? (audits[1] as AuditRow) : null;
        const status = getOverallStatus(latest.overall_score);
        const improvements = getImprovements(latest);

        // Score history for trend
        const history = audits.map((a: AuditRow) => ({
            date: a.created_at,
            score: a.overall_score,
            businessName: a.business_name,
        })).reverse();

        // Issues from latest audit
        const issues = Array.isArray(latest.issues) ? latest.issues : [];

        return NextResponse.json({
            hasData: true,
            latest: {
                id: latest.id,
                businessName: latest.business_name,
                overallScore: latest.overall_score,
                profileComplete: latest.profile_complete,
                contentActivity: latest.content_activity,
                engagement: latest.engagement,
                createdAt: latest.created_at,
            },
            previous: previous ? {
                overallScore: previous.overall_score,
                profileComplete: previous.profile_complete,
                contentActivity: previous.content_activity,
                engagement: previous.engagement,
            } : null,
            status,
            improvements,
            issues,
            history,
            totalAudits: audits.length,
        });
    } catch (err) {
        console.error("Reports API error:", err);
        return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
    }
}
