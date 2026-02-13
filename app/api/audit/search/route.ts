import { NextResponse } from "next/server";

// GET /api/audit/search?q=business+name
// Searches Google Places for businesses and returns name, address, rating, photos etc.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
        return NextResponse.json(
            { error: "Search query must be at least 2 characters" },
            { status: 400 }
        );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return NextResponse.json({
            results: [],
            fallback: true,
            message: "Google Places API not configured. Enter business name manually.",
        });
    }

    try {
        // Use Google Places Text Search (New) API with detailed fields
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
                        "places.nationalPhoneNumber",
                        "places.internationalPhoneNumber",
                        "places.websiteUri",
                        "places.regularOpeningHours",
                        "places.photos",
                        "places.editorialSummary",
                        "places.businessStatus",
                    ].join(","),
                },
                body: JSON.stringify({
                    textQuery: query,
                    languageCode: "en",
                    maxResultCount: 5,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Google Places API error:", data);
            return NextResponse.json({
                results: [],
                fallback: true,
                message: "Search failed. Enter business name manually.",
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results = (data.places || []).map((place: any) => ({
            place_id: place.id,
            name: place.displayName?.text || "",
            address: place.formattedAddress || "",
            rating: place.rating || null,
            review_count: place.userRatingCount || 0,
            types: place.types || [],
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || null,
            website: place.websiteUri || null,
            has_hours: !!(place.regularOpeningHours?.periods?.length),
            photo_count: place.photos?.length || 0,
            description: place.editorialSummary?.text || null,
            business_status: place.businessStatus || null,
        }));

        return NextResponse.json({ results, fallback: false });
    } catch (err) {
        console.error("Places search error:", err);
        return NextResponse.json({
            results: [],
            fallback: true,
            message: "Search failed. Enter business name manually.",
        });
    }
}
