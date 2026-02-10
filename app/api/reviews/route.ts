import { NextResponse } from "next/server";

// GET /api/reviews - List reviews
export async function GET() {
    // TODO: Fetch from database with auth
    return NextResponse.json({
        reviews: [],
        total: 0,
    });
}
