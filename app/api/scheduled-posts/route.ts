import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// GET /api/scheduled-posts — list user's scheduled posts
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const service = createServiceClient();
        const { data: posts, error } = await service
            .from("scheduled_posts")
            .select("*")
            .eq("user_id", user.id)
            .order("scheduled_at", { ascending: false });

        if (error) {
            console.error("Fetch scheduled posts error:", error);
            return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
        }

        return NextResponse.json({ posts: posts || [] });
    } catch (err) {
        console.error("Scheduled posts GET error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/scheduled-posts — create a new scheduled post
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { type, content, image_url, scheduled_at, business_name } = body;

        if (!content || !scheduled_at) {
            return NextResponse.json(
                { error: "content and scheduled_at are required" },
                { status: 400 }
            );
        }

        // Validate scheduled_at is in the future
        if (new Date(scheduled_at) <= new Date()) {
            return NextResponse.json(
                { error: "Scheduled time must be in the future" },
                { status: 400 }
            );
        }

        const service = createServiceClient();
        const { data: post, error } = await service
            .from("scheduled_posts")
            .insert({
                user_id: user.id,
                type: type || "UPDATE",
                content,
                image_url: image_url || null,
                business_name: business_name || null,
                scheduled_at,
                status: "scheduled",
            })
            .select()
            .single();

        if (error) {
            console.error("Create scheduled post error:", error);
            return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
        }

        return NextResponse.json(post, { status: 201 });
    } catch (err) {
        console.error("Scheduled posts POST error:", err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}

// DELETE /api/scheduled-posts?id=xxx — delete a scheduled post
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("id");

        if (!postId) {
            return NextResponse.json({ error: "Post id is required" }, { status: 400 });
        }

        const service = createServiceClient();

        // Verify ownership and delete
        const { error } = await service
            .from("scheduled_posts")
            .delete()
            .eq("id", postId)
            .eq("user_id", user.id);

        if (error) {
            console.error("Delete scheduled post error:", error);
            return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Scheduled posts DELETE error:", err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
