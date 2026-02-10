import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // TODO: Implement actual Supabase auth login
        // For now, return a placeholder response
        return NextResponse.json({
            user: { id: "placeholder", email },
            message: "Login successful",
        });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
