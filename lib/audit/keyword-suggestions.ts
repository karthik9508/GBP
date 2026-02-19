// ==========================================
// Keyword Optimization Suggestions via OpenAI
// ==========================================

export interface KeywordSuggestions {
    primaryKeywords: string[];
    longTailKeywords: string[];
    localKeywords: string[];
    descriptionSuggestion: string;
    postKeywords: string[];
}

/**
 * Generate keyword suggestions for the business using OpenAI
 */
export async function suggestKeywords(
    businessName: string,
    category: string,
    description: string | null,
    address: string
): Promise<KeywordSuggestions> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return generateFallbackKeywords(businessName, category, address);
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a local SEO expert specializing in Google Business Profile optimization for Indian businesses. Generate keyword suggestions in JSON format.`,
                    },
                    {
                        role: "user",
                        content: `Generate keyword optimization suggestions for this business:
- Business Name: ${businessName}
- Category: ${category}
- Location: ${address}
- Current Description: ${description || "No description set"}

Return a JSON object with these fields:
{
  "primaryKeywords": ["5-7 main keywords for this business type"],
  "longTailKeywords": ["5-7 long-tail search phrases customers would use"],
  "localKeywords": ["5-7 location-specific keywords"],
  "descriptionSuggestion": "A 750-character optimized description for GBP",
  "postKeywords": ["5-7 keywords to use in GBP posts"]
}

Focus on high-intent, local search terms that real customers would use. Include both English and Hindi transliterated terms if applicable.`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
                response_format: { type: "json_object" },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI keyword error:", data);
            return generateFallbackKeywords(businessName, category, address);
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            return generateFallbackKeywords(businessName, category, address);
        }

        const parsed = JSON.parse(content);

        return {
            primaryKeywords: parsed.primaryKeywords || [],
            longTailKeywords: parsed.longTailKeywords || [],
            localKeywords: parsed.localKeywords || [],
            descriptionSuggestion: parsed.descriptionSuggestion || "",
            postKeywords: parsed.postKeywords || [],
        };
    } catch (err) {
        console.error("Keyword suggestion error:", err);
        return generateFallbackKeywords(businessName, category, address);
    }
}

function generateFallbackKeywords(
    businessName: string,
    category: string,
    address: string
): KeywordSuggestions {
    // Extract city from address
    const parts = address.split(",").map(p => p.trim());
    const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "your city";
    const area = parts.length >= 3 ? parts[parts.length - 3] : "";

    const categoryLower = category.toLowerCase().replace(/_/g, " ");

    return {
        primaryKeywords: [
            `best ${categoryLower}`,
            `${categoryLower} near me`,
            `top ${categoryLower}`,
            `${categoryLower} in ${city}`,
            businessName.toLowerCase(),
        ],
        longTailKeywords: [
            `best ${categoryLower} in ${city}`,
            `affordable ${categoryLower} near me`,
            `${categoryLower} with good reviews`,
            `${categoryLower} open now`,
            `top rated ${categoryLower} in ${area || city}`,
        ],
        localKeywords: [
            `${categoryLower} in ${city}`,
            area ? `${categoryLower} in ${area}` : `${categoryLower} nearby`,
            `${categoryLower} ${city}`,
            `near me ${categoryLower}`,
            `local ${categoryLower}`,
        ],
        descriptionSuggestion: `${businessName} is a leading ${categoryLower} located in ${address}. We offer quality services with a focus on customer satisfaction. Visit us today or call to learn more about our offerings.`,
        postKeywords: [
            `#${categoryLower.replace(/\s/g, "")}`,
            `#${city.replace(/\s/g, "")}`,
            `#best${categoryLower.replace(/\s/g, "")}`,
            `#local${categoryLower.replace(/\s/g, "")}`,
            area ? `#${area.replace(/\s/g, "")}` : `#localbusiness`,
        ],
    };
}
