import { NextResponse } from "next/server";

// GET /api/posts - List posts
export async function GET() {
    // TODO: Fetch from database with auth
    return NextResponse.json({
        posts: [],
        total: 0,
    });
}

// POST /api/posts - Create post
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessId, type, content, scheduledAt } = body;

        if (!content || !scheduledAt) {
            return NextResponse.json(
                { error: "Content and scheduled date are required" },
                { status: 400 }
            );
        }

        // TODO: Save to database
        return NextResponse.json({
            id: "placeholder",
            businessId,
            type: type || "UPDATE",
            content,
            scheduledAt,
            status: "scheduled",
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
