import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { calculateAuditScore, generateRecommendations, generateMockAuditResult } from "@/lib/audit/scoring";
import { runPremiumChecklist, generateFixGuide } from "@/lib/audit/premium-checklist";
import { analyzeCompetitors } from "@/lib/audit/competitor-analysis";
import { suggestKeywords } from "@/lib/audit/keyword-suggestions";
import { analyzeReviewSentiment } from "@/lib/audit/review-sentiment";
import type { Json } from "@/lib/supabase/types";

export async function POST(request: Request) {
    try {
        const { businessName, email, placeId, address, placeDetails, premium } = await request.json();

        if (!businessName || businessName.trim().length < 2) {
            return NextResponse.json(
                { error: "Please enter a valid business name" },
                { status: 400 }
            );
        }

        // Check subscription for premium audit
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (premium) {
            if (!user) {
                return NextResponse.json(
                    { error: "Login required for premium audit", requireLogin: true },
                    { status: 401 }
                );
            }

            // Use service role to bypass RLS for subscription check
            const serviceClient = createServiceClient();
            const { data: userData } = await serviceClient
                .from("users")
                .select("subscription_tier, subscription_status")
                .eq("id", user.id)
                .single();

            const isPro = userData &&
                ["pro", "lifetime"].includes(userData.subscription_tier || "") &&
                userData.subscription_status === "active";

            if (!isPro) {
                return NextResponse.json(
                    { error: "Premium audit requires Pro subscription", requireUpgrade: true },
                    { status: 403 }
                );
            }
        }

        let result;

        if (placeId && placeDetails) {
            // Use REAL data from Google Places API
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
                isPremium: !!premium,
            };

            // ===== PREMIUM FEATURES =====
            if (premium) {
                // 1. 47-point Checklist
                const checklistResult = runPremiumChecklist(placeDetails);

                // 2. Fix Guide from failed items
                const fixGuide = generateFixGuide(checklistResult.checklist);

                // 3. Competitor Analysis (run in parallel with AI calls)
                const [competitors, keywords, sentiment] = await Promise.all([
                    analyzeCompetitors(
                        placeId,
                        placeDetails.name || businessName.trim(),
                        placeDetails.types || [],
                        placeDetails.address || address || "",
                        placeDetails.rating || 0,
                        placeDetails.review_count || 0,
                        placeDetails.photo_count || 0
                    ),
                    suggestKeywords(
                        placeDetails.name || businessName.trim(),
                        placeDetails.types?.[0] || "business",
                        placeDetails.description || null,
                        placeDetails.address || address || ""
                    ),
                    analyzeReviewSentiment(
                        placeDetails.name || businessName.trim(),
                        placeDetails.types?.[0] || "business",
                        placeDetails.rating || 0,
                        placeDetails.review_count || 0,
                        placeDetails.address || address || ""
                    ),
                ]);

                result = {
                    ...result,
                    checklist: {
                        items: checklistResult.checklist,
                        passedCount: checklistResult.passedCount,
                        totalCount: checklistResult.totalCount,
                        categoryScores: checklistResult.categoryScores,
                    },
                    competitors,
                    keywordSuggestions: keywords,
                    reviewSentiment: sentiment,
                    fixGuide,
                };
            }
        } else {
            // Fallback to mock when Places API is not available
            result = generateMockAuditResult(businessName.trim());
        }

        // Save audit to database
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
