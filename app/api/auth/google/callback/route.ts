import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?error=google_auth_failed", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?error=no_code", process.env.NEXT_PUBLIC_APP_URL!)
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
                new URL("/dashboard/settings?error=token_exchange_failed", process.env.NEXT_PUBLIC_APP_URL!)
            );
        }

        // Get current authenticated user
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.redirect(
                new URL("/login?error=not_authenticated", process.env.NEXT_PUBLIC_APP_URL!)
            );
        }

        const service = createServiceClient();

        // Get user info from Google
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        );
        const userInfo = await userInfoResponse.json();

        // Update user profile with Google info
        await service
            .from("users")
            .update({
                name: userInfo.name || undefined,
                avatar_url: userInfo.picture || undefined,
                google_id: userInfo.id,
            })
            .eq("id", user.id);

        // Store tokens for future GBP API access (when business.manage scope is available)
        // For now, just save the Google account connection
        const { data: existingBiz } = await service
            .from("businesses")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

        if (existingBiz && existingBiz.length > 0) {
            await service
                .from("businesses")
                .update({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token || null,
                    token_expires_at: tokens.expires_in
                        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
                        : null,
                })
                .eq("id", existingBiz[0].id);
        }
        // Note: We don't create a business entry here without business.manage scope
        // because we can't fetch the user's GBP location ID

        // Redirect to settings with success
        return NextResponse.redirect(
            new URL("/dashboard/settings?gbp=connected", process.env.NEXT_PUBLIC_APP_URL!)
        );
    } catch (err) {
        console.error("Google OAuth callback error:", err);
        return NextResponse.redirect(
            new URL("/dashboard/settings?error=callback_failed", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }
}
