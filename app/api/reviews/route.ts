import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reviews - List reviews for authenticated user
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const businessId = searchParams.get("businessId");
        const rating = searchParams.get("rating");
        const responded = searchParams.get("responded");

        let query = supabase
            .from("reviews")
            .select(`
                *,
                businesses!inner(user_id, name)
            `)
            .eq("businesses.user_id", user.id)
            .order("review_date", { ascending: false });

        if (businessId) {
            query = query.eq("business_id", businessId);
        }

        if (rating) {
            query = query.eq("rating", parseInt(rating));
        }

        if (responded === "true") {
            query = query.eq("reply_status", "posted");
        } else if (responded === "false") {
            query = query.eq("reply_status", "pending");
        }

        const { data: reviews, error } = await query;

        if (error) {
            console.error("Failed to fetch reviews:", error);
            return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
        }

        return NextResponse.json({
            reviews: reviews || [],
            total: reviews?.length || 0,
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
