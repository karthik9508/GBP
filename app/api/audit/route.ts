import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateAuditScore, generateRecommendations, generateMockAuditResult } from "@/lib/audit/scoring";
import type { Json } from "@/lib/supabase/types";

export async function POST(request: Request) {
    try {
        const { businessName, email, placeId, address, placeDetails } = await request.json();

        if (!businessName || businessName.trim().length < 2) {
            return NextResponse.json(
                { error: "Please enter a valid business name" },
                { status: 400 }
            );
        }

        let result;

        if (placeId && placeDetails) {
            // ✅ Use REAL data from Google Places API
            const auditScoring = calculateAuditScore({
                businessName: placeDetails.name || businessName.trim(),
                hasAddress: !!placeDetails.address,
                hasPhone: !!placeDetails.phone,
                hasWebsite: !!placeDetails.website,
                hasCategory: placeDetails.types && placeDetails.types.length > 0,
                hasDescription: !!placeDetails.description,
                hasPhotos: (placeDetails.photo_count || 0) > 0,
                photoCount: placeDetails.photo_count || 0,
                hasBusinessHours: !!placeDetails.has_hours,
                totalReviews: placeDetails.review_count || 0,
                averageRating: placeDetails.rating || 0,
                // Response rate not available from Places API, estimate based on review count
                responseRate: (placeDetails.review_count || 0) > 10 ? 50 : 20,
            });

            const recommendations = generateRecommendations(auditScoring.issues);

            result = {
                ...auditScoring,
                recommendations,
                businessName: placeDetails.name || businessName.trim(),
                address: placeDetails.address || address || null,
                rating: placeDetails.rating || null,
                reviewCount: placeDetails.review_count || 0,
                photoCount: placeDetails.photo_count || 0,
                hasWebsite: !!placeDetails.website,
                hasPhone: !!placeDetails.phone,
                hasHours: !!placeDetails.has_hours,
            };
        } else {
            // Fallback to mock when Places API is not available
            result = generateMockAuditResult(businessName.trim());
        }

        // Save audit to database (works for both logged-in and anonymous users)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from("audits").insert({
            user_id: user?.id || null,
            business_name: businessName.trim(),
            email: email || null,
            overall_score: result.score,
            profile_complete: result.profileComplete,
            content_activity: result.contentActivity,
            engagement: result.engagement,
            issues: result.issues as unknown as Json[],
            recommendations: result.recommendations as unknown as Json[],
        });

        if (email) {
            // TODO: Send email report via Resend
            console.log(`Audit report will be sent to: ${email}`);
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Audit error:", err);
        return NextResponse.json(
            { error: "Failed to run audit. Please try again." },
            { status: 500 }
        );
    }
}
