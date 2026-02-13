import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// This endpoint is called by Vercel Cron to publish scheduled posts
// Runs every 5 minutes

export async function GET(request: Request) {
    // Verify cron secret (Vercel sends this header)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    try {
        // Find posts that are scheduled and due
        const { data: duePosts, error } = await supabase
            .from("posts")
            .select(`
                *,
                businesses(access_token, refresh_token, gbp_location_id)
            `)
            .eq("status", "scheduled")
            .lte("scheduled_at", new Date().toISOString())
            .order("scheduled_at", { ascending: true })
            .limit(10);

        if (error) {
            console.error("Failed to fetch due posts:", error);
            return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
        }

        let published = 0;
        let failed = 0;

        for (const post of duePosts || []) {
            try {
                // Mark as publishing
                await supabase
                    .from("posts")
                    .update({ status: "publishing" })
                    .eq("id", post.id);

                // TODO: Publish to Google Business Profile API
                // const gbpResponse = await publishToGBP(post, post.businesses);

                // For now, mark as published (replace with real GBP API call)
                await supabase
                    .from("posts")
                    .update({
                        status: "published",
                        published_at: new Date().toISOString(),
                    })
                    .eq("id", post.id);

                published++;
            } catch (err) {
                console.error(`Failed to publish post ${post.id}:`, err);

                await supabase
                    .from("posts")
                    .update({
                        status: post.retry_count >= 3 ? "failed" : "scheduled",
                        retry_count: post.retry_count + 1,
                        error_message: err instanceof Error ? err.message : "Unknown error",
                    })
                    .eq("id", post.id);

                failed++;
            }
        }

        return NextResponse.json({
            message: `Processed ${(duePosts || []).length} posts`,
            published,
            failed,
        });
    } catch (err) {
        console.error("Cron publish-posts error:", err);
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}
