import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.text();

        // TODO: Verify webhook signature with Razorpay secret
        const event = JSON.parse(body);
        const eventType = event?.event;

        switch (eventType) {
            case "payment.captured":
                // TODO: Update payment status in DB
                console.log("Payment captured:", event.payload?.payment?.entity?.id);
                break;
            case "payment.failed":
                console.log("Payment failed:", event.payload?.payment?.entity?.id);
                break;
            case "subscription.charged":
                console.log("Subscription charged");
                break;
            case "subscription.cancelled":
                console.log("Subscription cancelled");
                break;
            default:
                console.log("Unhandled webhook event:", eventType);
        }

        return NextResponse.json({ received: true });
    } catch {
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
