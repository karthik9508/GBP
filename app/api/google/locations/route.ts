import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { fetchAccounts, fetchLocations } from "@/lib/google/business-profile";

// GET /api/google/locations — fetch user's GBP locations and save to businesses table
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const service = createServiceClient();

        // Get user's stored Google tokens
        const { data: businesses } = await service
            .from("businesses")
            .select("access_token, refresh_token")
            .eq("user_id", user.id)
            .limit(1);

        const storedToken = businesses?.[0]?.access_token;
        if (!storedToken) {
            return NextResponse.json(
                { error: "Google Business Profile not connected. Please connect via Settings." },
                { status: 400 }
            );
        }

        // Fetch accounts
        const accounts = await fetchAccounts(storedToken);
        if (accounts.length === 0) {
            return NextResponse.json(
                { error: "No Google Business accounts found. Make sure you have a Google Business Profile." },
                { status: 404 }
            );
        }

        // Fetch locations for each account
        const allLocations = [];
        for (const account of accounts) {
            const locations = await fetchLocations(storedToken, account.name);
            for (const loc of locations) {
                const address = loc.storefrontAddress?.addressLines?.join(", ")
                    || loc.storefrontAddress?.locality
                    || null;

                // Upsert into businesses table
                const { data: existing } = await service
                    .from("businesses")
                    .select("id")
                    .eq("gbp_location_id", loc.name)
                    .eq("user_id", user.id)
                    .single();

                if (existing) {
                    await service
                        .from("businesses")
                        .update({
                            name: loc.title,
                            address,
                            phone: loc.phoneNumbers?.primaryPhone || null,
                            website_url: loc.websiteUri || null,
                        })
                        .eq("id", existing.id);
                } else {
                    await service
                        .from("businesses")
                        .insert({
                            user_id: user.id,
                            gbp_location_id: loc.name,
                            name: loc.title,
                            address,
                            phone: loc.phoneNumbers?.primaryPhone || null,
                            website_url: loc.websiteUri || null,
                            access_token: storedToken,
                            refresh_token: businesses?.[0]?.refresh_token || null,
                        });
                }

                allLocations.push({
                    id: loc.name,
                    name: loc.title,
                    address,
                });
            }
        }

        return NextResponse.json({ locations: allLocations });
    } catch (err) {
        console.error("Google locations error:", err);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
