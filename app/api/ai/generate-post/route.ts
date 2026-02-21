import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POST_TEMPLATES: Record<string, string[]> = {
    UPDATE: [
        "🎉 Exciting news from {business}! We're thrilled to share {topic}. Visit us today and experience the difference!",
        "📢 {business} update: {topic}! We're constantly improving to serve you better. Come check it out!",
        "✨ Big things happening at {business}! {topic} — we can't wait for you to see what we've been working on!",
    ],
    OFFER: [
        "🔥 Special offer at {business}! {topic} — limited time only! Don't miss out on this amazing deal! 🎁",
        "💰 Exclusive deal alert from {business}: {topic}! Hurry, this offer won't last forever! ⏰",
        "🎉 {business} presents: {topic}! Grab this incredible offer before it's gone! 🛒",
    ],
    EVENT: [
        "📅 Mark your calendars! {business} is hosting {topic}. We'd love to see you there! 🎊",
        "🎪 Join us at {business} for {topic}! It's going to be an unforgettable experience! ✨",
        "🗓️ {business} event coming up: {topic}! Save the date and spread the word! 🎉",
    ],
    PRODUCT: [
        "🆕 Introducing at {business}: {topic}! Come discover our latest addition today! ⭐",
        "🛍️ New arrival at {business}! {topic} — now available! Be among the first to try it! 🎯",
        "✨ {business} proudly presents: {topic}! Quality you can trust, experience you'll love! 💎",
    ],
};

async function generateWithAI(businessName: string, postType: string, topic: string): Promise<string | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("your-openai")) {
        return null; // No valid API key
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a social media expert for Google Business Profile posts. Write engaging, concise posts for Indian businesses. Use emojis naturally. Keep posts under 300 words. Include a call-to-action. Do NOT use hashtags.`,
                    },
                    {
                        role: "user",
                        content: `Write a Google Business Profile ${postType.toLowerCase()} post for "${businessName}" about: ${topic}`,
                    },
                ],
                max_tokens: 400,
                temperature: 0.8,
            }),
        });

        if (!response.ok) {
            console.error("OpenAI API error:", response.status, await response.text());
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (err) {
        console.error("OpenAI request failed:", err);
        return null;
    }
}

function generateFromTemplate(businessName: string, postType: string, topic: string): string {
    const templates = POST_TEMPLATES[postType] || POST_TEMPLATES.UPDATE;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/\{business\}/g, businessName).replace(/\{topic\}/g, topic);
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { businessName, postType, topic } = body;

        if (!topic) {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 }
            );
        }

        const name = businessName || "Our Business";
        const type = postType || "UPDATE";

        // Try AI first, fall back to template
        let content = await generateWithAI(name, type, topic);
        let source: "ai" | "template" = "ai";

        if (!content) {
            content = generateFromTemplate(name, type, topic);
            source = "template";
        }

        return NextResponse.json({
            content,
            source,
        });
    } catch (err) {
        console.error("Generate post error:", err);
        return NextResponse.json(
            { error: "Failed to generate post content" },
            { status: 500 }
        );
    }
}
