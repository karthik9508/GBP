import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(
            new URL("/login?error=google_auth_failed", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=no_code", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Google token exchange failed:", tokens);
            return NextResponse.redirect(
                new URL("/login?error=token_exchange_failed", process.env.NEXT_PUBLIC_APP_URL!)
            );
        }

        // Get user info
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            }
        );

        const userInfo = await userInfoResponse.json();

        // TODO: Create or update user in database
        // TODO: Store tokens securely
        // TODO: Set session cookie

        console.log("Google auth successful for:", userInfo.email);

        return NextResponse.redirect(
            new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL!)
        );
    } catch (err) {
        console.error("Google OAuth callback error:", err);
        return NextResponse.redirect(
            new URL("/login?error=callback_failed", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }
}
