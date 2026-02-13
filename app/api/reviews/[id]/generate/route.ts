import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: reviewId } = await params;
        const { tone } = await request.json();

        // Fetch the review and verify ownership
        const { data: review } = await supabase
            .from("reviews")
            .select(`
                *,
                businesses!inner(user_id, name)
            `)
            .eq("id", reviewId)
            .eq("businesses.user_id", user.id)
            .single();

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Call OpenAI to generate response
        const openaiApiKey = process.env.OPENAI_API_KEY;

        if (!openaiApiKey) {
            return NextResponse.json(
                { error: "OpenAI API not configured" },
                { status: 500 }
            );
        }

        const toneMap: Record<string, string> = {
            professional: "Respond in a professional, courteous business tone.",
            friendly: "Respond in a warm, friendly, and personable tone.",
            apologetic: "Respond with empathy and a sincere apology, offering to make things right.",
        };
        const toneInstruction = toneMap[tone || "professional"] || "Respond in a professional tone.";

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a business owner responding to a Google review for "${review.businesses?.name || "the business"}". ${toneInstruction} Keep the response under 150 words. Do not use markdown formatting.`,
                    },
                    {
                        role: "user",
                        content: `Review (${review.rating} stars): "${review.comment || "No comment provided"}" by ${review.reviewer_name}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 200,
            }),
        });

        const aiResult = await openaiResponse.json();
        const generatedReply = aiResult.choices?.[0]?.message?.content || "";

        // Track AI usage
        const inputTokens = aiResult.usage?.prompt_tokens || 0;
        const outputTokens = aiResult.usage?.completion_tokens || 0;
        await supabase.from("ai_usage").insert({
            user_id: user.id,
            action_type: "review_response",
            model: "gpt-4o-mini",
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            cost_usd: (inputTokens * 0.00000015 + outputTokens * 0.0000006),
            metadata: { review_id: reviewId, tone },
        });

        // Save generated reply to review
        await supabase
            .from("reviews")
            .update({
                ai_generated_reply: generatedReply,
                reply_status: "ai_generated",
            })
            .eq("id", reviewId);

        return NextResponse.json({
            reviewId,
            tone: tone || "professional",
            response: generatedReply,
        });
    } catch (err) {
        console.error("AI response generation error:", err);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
