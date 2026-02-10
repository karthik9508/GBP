import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { tone } = await request.json();
        const reviewId = params.id;

        // TODO: Integrate with OpenAI GPT-4o-mini
        const mockResponse = `Thank you for taking the time to share your feedback! We truly value your input and are committed to providing the best experience possible. We hope to see you again soon!`;

        return NextResponse.json({
            reviewId,
            tone: tone || "professional",
            response: mockResponse,
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
