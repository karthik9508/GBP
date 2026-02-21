// ==========================================
// Google Business Profile API Helper
// ==========================================

const GBP_API_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";
const GBP_POST_API = "https://mybusiness.googleapis.com/v4";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

/** Refresh an expired Google access token */
export async function refreshAccessToken(
    refreshToken: string
): Promise<{ access_token: string; expires_in: number } | null> {
    try {
        const res = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }),
        });

        if (!res.ok) {
            console.error("Token refresh failed:", await res.text());
            return null;
        }

        return await res.json();
    } catch (err) {
        console.error("Token refresh error:", err);
        return null;
    }
}

/** Fetch Google accounts (needed for location listing) */
export async function fetchAccounts(
    accessToken: string
): Promise<{ name: string; accountName: string; type: string }[]> {
    try {
        const res = await fetch(
            "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!res.ok) {
            console.error("Fetch accounts failed:", res.status, await res.text());
            return [];
        }

        const data = await res.json();
        return data.accounts || [];
    } catch (err) {
        console.error("Fetch accounts error:", err);
        return [];
    }
}

/** Fetch business locations for a Google account */
export async function fetchLocations(
    accessToken: string,
    accountName: string
): Promise<
    {
        name: string;
        title: string;
        storefrontAddress?: { addressLines?: string[]; locality?: string };
        phoneNumbers?: { primaryPhone?: string };
        websiteUri?: string;
    }[]
> {
    try {
        const res = await fetch(
            `${GBP_API_BASE}/${accountName}/locations?readMask=name,title,storefrontAddress,phoneNumbers,websiteUri`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!res.ok) {
            console.error("Fetch locations failed:", res.status, await res.text());
            return [];
        }

        const data = await res.json();
        return data.locations || [];
    } catch (err) {
        console.error("Fetch locations error:", err);
        return [];
    }
}

/** Publish a local post to Google Business Profile */
export async function publishLocalPost(
    accessToken: string,
    locationName: string, // format: "accounts/{id}/locations/{id}"
    post: {
        type: string;
        content: string;
        imageUrl?: string | null;
    }
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // Build the post body per Google's API
        const body: Record<string, unknown> = {
            languageCode: "en",
            summary: post.content,
            topicType: mapPostType(post.type),
        };

        // Add media if image provided
        if (post.imageUrl) {
            body.media = [
                {
                    mediaFormat: "PHOTO",
                    sourceUrl: post.imageUrl,
                },
            ];
        }

        // Add call-to-action for offers
        if (post.type === "OFFER") {
            body.callToAction = {
                actionType: "LEARN_MORE",
                url: post.imageUrl || "",
            };
        }

        const res = await fetch(
            `${GBP_POST_API}/${locationName}/localPosts`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Publish post failed:", res.status, errorText);
            return { success: false, error: `Google API error: ${res.status} - ${errorText}` };
        }

        const data = await res.json();
        return {
            success: true,
            postId: data.name, // Google's post resource name
        };
    } catch (err) {
        console.error("Publish post error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/** Map our post type to Google's topicType */
function mapPostType(type: string): string {
    switch (type) {
        case "OFFER":
            return "OFFER";
        case "EVENT":
            return "EVENT";
        case "PRODUCT":
            return "STANDARD";
        case "UPDATE":
        default:
            return "STANDARD";
    }
}
