import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { amount, planType } = await request.json();

        if (!amount || !planType) {
            return NextResponse.json(
                { error: "Amount and plan type are required" },
                { status: 400 }
            );
        }

        // TODO: Integrate with Razorpay SDK
        return NextResponse.json({
            id: "order_placeholder",
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
