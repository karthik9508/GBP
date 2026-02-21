import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { refreshAccessToken, publishLocalPost } from "@/lib/google/business-profile";

// Cron endpoint — publish scheduled posts to Google Business Profile
// Runs every 5 minutes via Vercel Cron or manually
// Config in vercel.json: { "crons": [{ "path": "/api/cron/publish-posts", "schedule": "*/5 * * * *" }] }

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    try {
        // Find scheduled posts that are due
        const { data: duePosts, error } = await supabase
            .from("scheduled_posts")
            .select("*")
            .eq("status", "scheduled")
            .lte("scheduled_at", new Date().toISOString())
            .order("scheduled_at", { ascending: true })
            .limit(10);

        if (error) {
            console.error("Fetch due posts error:", error);
            return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
        }

        if (!duePosts || duePosts.length === 0) {
            return NextResponse.json({ message: "No posts due", published: 0, failed: 0 });
        }

        let published = 0;
        let failed = 0;

        for (const post of duePosts) {
            try {
                // Get the user's business (with Google tokens)
                const { data: businesses } = await supabase
                    .from("businesses")
                    .select("id, gbp_location_id, access_token, refresh_token, token_expires_at")
                    .eq("user_id", post.user_id)
                    .limit(1);

                const business = businesses?.[0];

                if (!business || !business.access_token) {
                    console.warn(`Post ${post.id}: No connected GBP account for user ${post.user_id}`);
                    // Still mark as published (locally scheduled, no GBP connection)
                    await supabase
                        .from("scheduled_posts")
                        .update({
                            status: "published",
                            published_at: new Date().toISOString(),
                        })
                        .eq("id", post.id);
                    published++;
                    continue;
                }

                // Check if token needs refresh
                let accessToken = business.access_token;
                if (business.token_expires_at && new Date(business.token_expires_at) <= new Date()) {
                    if (!business.refresh_token) {
                        console.error(`Post ${post.id}: Token expired and no refresh token`);
                        await markFailed(supabase, post.id, "Google token expired. Please reconnect.");
                        failed++;
                        continue;
                    }

                    const refreshed = await refreshAccessToken(business.refresh_token);
                    if (!refreshed) {
                        await markFailed(supabase, post.id, "Failed to refresh Google token.");
                        failed++;
                        continue;
                    }

                    accessToken = refreshed.access_token;

                    // Update stored token
                    await supabase
                        .from("businesses")
                        .update({
                            access_token: refreshed.access_token,
                            token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
                        })
                        .eq("id", business.id);
                }

                // Publish to Google Business Profile
                const result = await publishLocalPost(accessToken, business.gbp_location_id, {
                    type: post.type,
                    content: post.content,
                    imageUrl: post.image_url,
                });

                if (result.success) {
                    await supabase
                        .from("scheduled_posts")
                        .update({
                            status: "published",
                            published_at: new Date().toISOString(),
                        })
                        .eq("id", post.id);
                    published++;
                    console.log(`Post ${post.id} published successfully. GBP ID: ${result.postId}`);
                } else {
                    await markFailed(supabase, post.id, result.error || "Unknown publish error");
                    failed++;
                }
            } catch (err) {
                console.error(`Post ${post.id} publish error:`, err);
                await markFailed(
                    supabase,
                    post.id,
                    err instanceof Error ? err.message : "Unknown error"
                );
                failed++;
            }
        }

        return NextResponse.json({
            message: `Processed ${duePosts.length} posts`,
            published,
            failed,
        });
    } catch (err) {
        console.error("Cron publish-posts error:", err);
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function markFailed(supabase: any, postId: string, errorMessage: string) {
    await supabase
        .from("scheduled_posts")
        .update({
            status: "failed",
        })
        .eq("id", postId);
    console.error(`Post ${postId} failed: ${errorMessage}`);
}
