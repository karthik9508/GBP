// ==========================================
// Competitor Analysis via Google Places API
// ==========================================

export interface CompetitorData {
    name: string;
    address: string;
    rating: number | null;
    reviewCount: number;
    photoCount: number;
    types: string[];
    placeId: string;
}

export interface CompetitorAnalysis {
    competitors: CompetitorData[];
    comparison: {
        yourRating: number;
        avgRating: number;
        yourReviews: number;
        avgReviews: number;
        yourPhotos: number;
        avgPhotos: number;
        ratingRank: number;   // 1 = best among competitors
        reviewRank: number;
        photoRank: number;
    };
    insights: string[];
}

/**
 * Fetch top competitors near the same location/category via Google Places Nearby Search
 */
export async function analyzeCompetitors(
    placeId: string,
    businessName: string,
    types: string[],
    address: string,
    rating: number,
    reviewCount: number,
    photoCount: number
): Promise<CompetitorAnalysis> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return generateMockCompetitorAnalysis(businessName, rating, reviewCount, photoCount);
    }

    try {
        // Use the same category to find competitors in the same area
        const searchQuery = `${types[0] || "business"} near ${address}`;

        const response = await fetch(
            "https://places.googleapis.com/v1/places:searchText",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": [
                        "places.id",
                        "places.displayName",
                        "places.formattedAddress",
                        "places.rating",
                        "places.userRatingCount",
                        "places.types",
                        "places.photos",
                    ].join(","),
                },
                body: JSON.stringify({
                    textQuery: searchQuery,
                    languageCode: "en",
                    maxResultCount: 10,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Competitor search error:", data);
            return generateMockCompetitorAnalysis(businessName, rating, reviewCount, photoCount);
        }

        // Filter out the original business and pick top 5
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const competitors: CompetitorData[] = (data.places || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((p: any) => p.id !== placeId)
            .slice(0, 5)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((p: any) => ({
                name: p.displayName?.text || "Unknown",
                address: p.formattedAddress || "",
                rating: p.rating || null,
                reviewCount: p.userRatingCount || 0,
                photoCount: p.photos?.length || 0,
                types: p.types || [],
                placeId: p.id,
            }));

        return buildComparison(competitors, rating, reviewCount, photoCount);
    } catch (err) {
        console.error("Competitor analysis error:", err);
        return generateMockCompetitorAnalysis(businessName, rating, reviewCount, photoCount);
    }
}

function buildComparison(
    competitors: CompetitorData[],
    yourRating: number,
    yourReviews: number,
    yourPhotos: number
): CompetitorAnalysis {
    if (competitors.length === 0) {
        return {
            competitors: [],
            comparison: {
                yourRating, avgRating: 0, yourReviews, avgReviews: 0, yourPhotos, avgPhotos: 0,
                ratingRank: 1, reviewRank: 1, photoRank: 1,
            },
            insights: ["No nearby competitors found for comparison."],
        };
    }

    const avgRating = competitors.reduce((sum, c) => sum + (c.rating || 0), 0) / competitors.length;
    const avgReviews = Math.round(competitors.reduce((sum, c) => sum + c.reviewCount, 0) / competitors.length);
    const avgPhotos = Math.round(competitors.reduce((sum, c) => sum + c.photoCount, 0) / competitors.length);

    // Calculate rankings (1 = best)
    const allRatings = [...competitors.map(c => c.rating || 0), yourRating].sort((a, b) => b - a);
    const allReviews = [...competitors.map(c => c.reviewCount), yourReviews].sort((a, b) => b - a);
    const allPhotos = [...competitors.map(c => c.photoCount), yourPhotos].sort((a, b) => b - a);

    const ratingRank = allRatings.indexOf(yourRating) + 1;
    const reviewRank = allReviews.indexOf(yourReviews) + 1;
    const photoRank = allPhotos.indexOf(yourPhotos) + 1;

    // Generate insights
    const insights: string[] = [];

    if (yourRating >= avgRating) {
        insights.push(`Your rating (${yourRating.toFixed(1)}) is above the competitor average (${avgRating.toFixed(1)}) — great!`);
    } else {
        insights.push(`Your rating (${yourRating.toFixed(1)}) is below the competitor average (${avgRating.toFixed(1)}). Focus on improving customer experience.`);
    }

    if (yourReviews >= avgReviews) {
        insights.push(`You have more reviews (${yourReviews}) than the competitor average (${avgReviews}). Keep up the momentum!`);
    } else {
        insights.push(`Competitors average ${avgReviews} reviews vs your ${yourReviews}. Run a review campaign to close the gap.`);
    }

    if (yourPhotos >= avgPhotos) {
        insights.push(`Your photo count (${yourPhotos}) beats the average (${avgPhotos}). Visual content drives clicks.`);
    } else {
        insights.push(`Competitors average ${avgPhotos} photos vs your ${yourPhotos}. Add more photos to improve click-through rate.`);
    }

    if (ratingRank === 1) insights.push("🏆 You have the highest rating in your area — maintain this advantage!");
    if (reviewRank === 1) insights.push("🏆 You have the most reviews in your area — social proof is your strength!");

    return {
        competitors,
        comparison: { yourRating, avgRating, yourReviews, avgReviews, yourPhotos, avgPhotos, ratingRank, reviewRank, photoRank },
        insights,
    };
}

function generateMockCompetitorAnalysis(
    _businessName: string,
    rating: number,
    reviewCount: number,
    photoCount: number
): CompetitorAnalysis {
    const mockCompetitors: CompetitorData[] = [
        { name: "Competitor A", address: "Nearby location", rating: 4.2, reviewCount: 85, photoCount: 15, types: [], placeId: "mock-1" },
        { name: "Competitor B", address: "Nearby location", rating: 3.8, reviewCount: 42, photoCount: 8, types: [], placeId: "mock-2" },
        { name: "Competitor C", address: "Nearby location", rating: 4.5, reviewCount: 120, photoCount: 22, types: [], placeId: "mock-3" },
        { name: "Competitor D", address: "Nearby location", rating: 4.0, reviewCount: 30, photoCount: 12, types: [], placeId: "mock-4" },
        { name: "Competitor E", address: "Nearby location", rating: 3.5, reviewCount: 18, photoCount: 5, types: [], placeId: "mock-5" },
    ];

    return buildComparison(mockCompetitors, rating, reviewCount, photoCount);
}
