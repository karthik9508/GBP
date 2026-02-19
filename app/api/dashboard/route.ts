import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const service = createServiceClient();

        // Fetch all in parallel
        const [auditsRes, userRes] = await Promise.all([
            // Recent audits (last 10)
            service
                .from("audits")
                .select("id, business_name, overall_score, profile_complete, content_activity, engagement, issues, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(10),

            // User subscription info
            service
                .from("users")
                .select("subscription_tier, subscription_status, subscription_end_date, name, email")
                .eq("id", user.id)
                .single(),
        ]);

        const audits = auditsRes.data || [];
        const profile = userRes.data;

        // Compute stats
        const totalAudits = audits.length;
        const latestScore = audits[0]?.overall_score ?? null;
        const previousScore = audits[1]?.overall_score ?? null;
        const scoreTrend = latestScore !== null && previousScore !== null
            ? latestScore - previousScore
            : null;

        // Count total issues across latest audit
        const latestIssues = audits[0]?.issues;
        const issueCount = Array.isArray(latestIssues) ? latestIssues.length : 0;

        return NextResponse.json({
            stats: {
                totalAudits,
                latestScore,
                scoreTrend,
                issueCount,
            },
            subscription: {
                tier: profile?.subscription_tier || "free",
                status: profile?.subscription_status || "inactive",
                expiresAt: profile?.subscription_end_date || null,
            },
            user: {
                name: profile?.name || user.user_metadata?.full_name || "",
                email: profile?.email || user.email || "",
            },
            recentAudits: audits.map((a) => ({
                id: a.id,
                businessName: a.business_name,
                score: a.overall_score,
                profileComplete: a.profile_complete,
                contentActivity: a.content_activity,
                engagement: a.engagement,
                issueCount: Array.isArray(a.issues) ? a.issues.length : 0,
                createdAt: a.created_at,
            })),
        });
    } catch (err) {
        console.error("Dashboard API error:", err);
        return NextResponse.json(
            { error: "Failed to load dashboard data" },
            { status: 500 }
        );
    }
}
