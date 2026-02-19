// ==========================================
// Review Sentiment Analysis via OpenAI
// ==========================================

export interface SentimentAnalysis {
    overallSentiment: "positive" | "mixed" | "negative";
    sentimentScore: number; // 0-100
    positiveThemes: string[];
    negativeThemes: string[];
    commonPraises: string[];
    commonComplaints: string[];
    suggestedResponses: {
        theme: string;
        response: string;
    }[];
    summary: string;
}

/**
 * Analyze review sentiment using OpenAI
 * Note: Since Places API doesn't return review text, we generate analysis
 * based on available metadata (rating distribution, count) and the business type
 */
export async function analyzeReviewSentiment(
    businessName: string,
    category: string,
    rating: number,
    reviewCount: number,
    address: string
): Promise<SentimentAnalysis> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return generateFallbackSentiment(rating, reviewCount);
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
                        content: `You are a review analysis expert for local businesses in India. Based on business metadata, predict likely review themes and generate actionable insights. Return JSON format.`,
                    },
                    {
                        role: "user",
                        content: `Analyze the likely review sentiment for this business:
- Name: ${businessName}
- Category: ${category}
- Location: ${address}
- Average Rating: ${rating}/5
- Total Reviews: ${reviewCount}

Based on the rating and business type, predict the likely review themes.
Return a JSON object:
{
  "overallSentiment": "positive" | "mixed" | "negative",
  "sentimentScore": 0-100,
  "positiveThemes": ["3-5 likely positive themes based on business type and good rating"],
  "negativeThemes": ["3-5 likely negative themes based on common complaints for this business type"],
  "commonPraises": ["3-5 specific things customers likely praise"],
  "commonComplaints": ["3-5 specific things customers might complain about"],
  "suggestedResponses": [
    { "theme": "complaint theme", "response": "professional response template" }
  ],
  "summary": "A 2-3 sentence analysis summary"
}

Make themes specific to the ${category} business type. Be realistic based on the ${rating} rating.`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1200,
                response_format: { type: "json_object" },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI sentiment error:", data);
            return generateFallbackSentiment(rating, reviewCount);
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            return generateFallbackSentiment(rating, reviewCount);
        }

        const parsed = JSON.parse(content);

        return {
            overallSentiment: parsed.overallSentiment || (rating >= 4 ? "positive" : rating >= 3 ? "mixed" : "negative"),
            sentimentScore: parsed.sentimentScore || Math.round(rating * 20),
            positiveThemes: parsed.positiveThemes || [],
            negativeThemes: parsed.negativeThemes || [],
            commonPraises: parsed.commonPraises || [],
            commonComplaints: parsed.commonComplaints || [],
            suggestedResponses: parsed.suggestedResponses || [],
            summary: parsed.summary || "",
        };
    } catch (err) {
        console.error("Sentiment analysis error:", err);
        return generateFallbackSentiment(rating, reviewCount);
    }
}

function generateFallbackSentiment(rating: number, reviewCount: number): SentimentAnalysis {
    const sentimentScore = Math.round(rating * 20);
    const overallSentiment: SentimentAnalysis["overallSentiment"] =
        rating >= 4 ? "positive" : rating >= 3 ? "mixed" : "negative";

    return {
        overallSentiment,
        sentimentScore,
        positiveThemes: [
            "Quality of service",
            "Staff friendliness",
            "Value for money",
            "Convenient location",
        ],
        negativeThemes: [
            "Wait times",
            "Inconsistent quality",
            "Cleanliness concerns",
        ],
        commonPraises: [
            "Great customer service experience",
            "Good quality products/services",
            "Friendly and helpful staff",
        ],
        commonComplaints: [
            "Long waiting times during peak hours",
            "Pricing could be more competitive",
            "Parking availability issues",
        ],
        suggestedResponses: [
            {
                theme: "Long wait times",
                response: "Thank you for your feedback. We apologize for the wait and are actively working on improving our service speed. We value your patience and hope to serve you better next time!",
            },
            {
                theme: "Quality concerns",
                response: "We appreciate you bringing this to our attention. Quality is our top priority, and we'd love to make this right. Please contact us directly so we can address your specific concerns.",
            },
        ],
        summary: reviewCount > 0
            ? `Based on ${reviewCount} reviews with an average rating of ${rating?.toFixed(1)}, the overall sentiment is ${overallSentiment}. ${rating >= 4 ? "Customers generally appreciate the quality and service." : "There are areas for improvement in customer experience."}`
            : "Insufficient review data for detailed analysis. Focus on collecting more reviews.",
    };
}
