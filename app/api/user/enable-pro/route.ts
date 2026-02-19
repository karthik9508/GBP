import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/user/enable-pro
 * Enables Pro tier for the currently logged-in user.
 * Uses service role to bypass RLS for the subscription update.
 */
export async function POST() {
    try {
        // Get the authenticated user via cookies
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Enable Pro auth error:", authError);
            return NextResponse.json(
                { error: "You must be logged in to enable Pro features." },
                { status: 401 }
            );
        }

        console.log("Enabling Pro for user:", user.id, user.email);

        // Use service role to bypass RLS for the update
        const serviceClient = createServiceClient();

        // First check if user row exists
        const { data: existingUser, error: selectError } = await serviceClient
            .from("users")
            .select("id, subscription_tier, subscription_status")
            .eq("id", user.id)
            .single();

        if (selectError || !existingUser) {
            console.error("User row not found, creating:", selectError);

            // Create the user row if it doesn't exist
            const { error: insertError } = await serviceClient
                .from("users")
                .insert({
                    id: user.id,
                    email: user.email || "",
                    name: user.user_metadata?.full_name || user.user_metadata?.name || "",
                    avatar_url: user.user_metadata?.avatar_url || "",
                    subscription_tier: "pro",
                    subscription_status: "active",
                    subscription_end_date: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                });

            if (insertError) {
                console.error("Insert user error:", insertError);
                return NextResponse.json(
                    { error: "Failed to create user profile. " + insertError.message },
                    { status: 500 }
                );
            }
        } else {
            // Update existing user to Pro
            const { error: updateError } = await serviceClient
                .from("users")
                .update({
                    subscription_tier: "pro",
                    subscription_status: "active",
                    subscription_end_date: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                })
                .eq("id", user.id);

            if (updateError) {
                console.error("Update user error:", updateError);
                return NextResponse.json(
                    { error: "Failed to enable Pro. " + updateError.message },
                    { status: 500 }
                );
            }
        }

        console.log("Pro enabled successfully for:", user.email);

        return NextResponse.json({
            success: true,
            message: "Pro features enabled successfully!",
            subscription: {
                tier: "pro",
                status: "active",
            },
        });
    } catch (err) {
        console.error("Enable pro error:", err);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

/**
 * GET /api/user/enable-pro
 * Check current subscription status
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ isPro: false, loggedIn: false });
        }

        // Use service role to bypass RLS
        const serviceClient = createServiceClient();

        const { data: userData } = await serviceClient
            .from("users")
            .select("subscription_tier, subscription_status, subscription_end_date")
            .eq("id", user.id)
            .single();

        const isPro = userData &&
            ["pro", "lifetime"].includes(userData.subscription_tier || "") &&
            userData.subscription_status === "active";

        return NextResponse.json({
            loggedIn: true,
            isPro: !!isPro,
            tier: userData?.subscription_tier || "free",
            status: userData?.subscription_status || "inactive",
            expiresAt: userData?.subscription_end_date || null,
        });
    } catch (err) {
        console.error("Check pro status error:", err);
        return NextResponse.json({ isPro: false, loggedIn: false });
    }
}
