import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/posts - List posts for authenticated user
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const businessId = searchParams.get("businessId");
        const status = searchParams.get("status");

        let query = supabase
            .from("posts")
            .select(`
                *,
                businesses!inner(user_id)
            `)
            .eq("businesses.user_id", user.id)
            .order("scheduled_at", { ascending: true });

        if (businessId) {
            query = query.eq("business_id", businessId);
        }

        if (status) {
            query = query.eq("status", status);
        }

        const { data: posts, error } = await query;

        if (error) {
            console.error("Failed to fetch posts:", error);
            return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
        }

        return NextResponse.json({
            posts: posts || [],
            total: posts?.length || 0,
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            business_id,
            type,
            content,
            scheduled_at,
            image_url,
            cta_type,
            cta_url,
            offer_terms,
            event_start_date,
            event_end_date,
        } = body;

        if (!business_id || !content || !scheduled_at) {
            return NextResponse.json(
                { error: "business_id, content, and scheduled_at are required" },
                { status: 400 }
            );
        }

        // Verify user owns this business
        const { data: business } = await supabase
            .from("businesses")
            .select("id")
            .eq("id", business_id)
            .eq("user_id", user.id)
            .single();

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const { data: post, error } = await supabase
            .from("posts")
            .insert({
                business_id,
                type: type || "UPDATE",
                content,
                scheduled_at,
                image_url: image_url || null,
                cta_type: cta_type || null,
                cta_url: cta_url || null,
                offer_terms: offer_terms || null,
                event_start_date: event_start_date || null,
                event_end_date: event_end_date || null,
                status: "scheduled",
            })
            .select()
            .single();

        if (error) {
            console.error("Failed to create post:", error);
            return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
        }

        return NextResponse.json(post, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
