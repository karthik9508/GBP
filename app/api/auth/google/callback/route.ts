import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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

        // Get user info from Google
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        );
        const userInfo = await userInfoResponse.json();

        // Use service client to bypass RLS for user upsert
        const supabase = createServiceClient();

        // Check if user exists by google_id
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("google_id", userInfo.id)
            .single();

        if (existingUser) {
            // Update existing user's tokens
            await supabase
                .from("users")
                .update({
                    name: userInfo.name,
                    avatar_url: userInfo.picture,
                })
                .eq("id", existingUser.id);

            // Store GBP tokens on the business if we have business.manage scope
            if (tokens.access_token) {
                await supabase
                    .from("businesses")
                    .update({
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token || null,
                        token_expires_at: tokens.expires_in
                            ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
                            : null,
                    })
                    .eq("user_id", existingUser.id);
            }
        } else {
            // Create new user
            await supabase.from("users").insert({
                email: userInfo.email,
                name: userInfo.name,
                google_id: userInfo.id,
                avatar_url: userInfo.picture,
            });
        }

        // Sign the user into Supabase Auth
        // We use signInWithPassword with a deterministic password derived from Google ID
        // Or better: sign in via Supabase's built-in Google OAuth
        // For custom Google OAuth (with GBP scopes), we create a session manually
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: userInfo.email,
            email_confirm: true,
            user_metadata: {
                name: userInfo.name,
                avatar_url: userInfo.picture,
                google_id: userInfo.id,
            },
        });

        if (authError && authError.message !== "A user with this email address has already been registered") {
            console.error("Supabase auth user creation error:", authError);
        }

        // Generate a magic link to sign the user in
        const { error: signInError } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: userInfo.email,
        });

        if (signInError) {
            console.error("Magic link generation error:", signInError);
        }

        // Redirect to dashboard - the middleware will handle session
        const response = NextResponse.redirect(
            new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL!)
        );

        return response;
    } catch (err) {
        console.error("Google OAuth callback error:", err);
        return NextResponse.redirect(
            new URL("/login?error=callback_failed", process.env.NEXT_PUBLIC_APP_URL!)
        );
    }
}
