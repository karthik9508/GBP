import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// This endpoint is called by Vercel Cron to sync reviews from Google
// Runs every hour

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    try {
        // Get all businesses with valid tokens
        const { data: businesses, error } = await supabase
            .from("businesses")
            .select("id, gbp_location_id, access_token, refresh_token, token_expires_at, user_id")
            .not("access_token", "is", null);

        if (error) {
            console.error("Failed to fetch businesses:", error);
            return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 });
        }

        let synced = 0;
        let errors = 0;

        for (const business of businesses || []) {
            try {
                // TODO: Fetch reviews from Google Business Profile API
                // const reviews = await fetchGBPReviews(business.gbp_location_id, business.access_token);

                // For each review, upsert into the reviews table
                // await supabase.from("reviews").upsert(reviews, { onConflict: "gbp_review_id" });

                synced++;
            } catch (err) {
                console.error(`Failed to sync reviews for business ${business.id}:`, err);
                errors++;
            }
        }

        return NextResponse.json({
            message: `Synced reviews for ${synced} businesses`,
            synced,
            errors,
        });
    } catch (err) {
        console.error("Cron sync-reviews error:", err);
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}
