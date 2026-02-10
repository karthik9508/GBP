import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing payment verification fields" },
                { status: 400 }
            );
        }

        // TODO: Verify signature with Razorpay SDK
        return NextResponse.json({
            verified: true,
            payment: {
                id: razorpay_payment_id,
                status: "captured",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
