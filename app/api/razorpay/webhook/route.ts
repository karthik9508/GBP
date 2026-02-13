import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(body)
                .digest("hex");

            if (expectedSignature !== signature) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
            }
        }

        const event = JSON.parse(body);
        const eventType = event?.event;

        // Use service client (bypass RLS for webhooks)
        const supabase = createServiceClient();

        switch (eventType) {
            case "payment.captured": {
                const paymentEntity = event.payload?.payment?.entity;
                if (paymentEntity) {
                    await supabase
                        .from("payments")
                        .update({
                            razorpay_payment_id: paymentEntity.id,
                            status: "captured",
                            method: paymentEntity.method,
                            email: paymentEntity.email,
                            contact: paymentEntity.contact,
                        })
                        .eq("razorpay_order_id", paymentEntity.order_id);
                }
                break;
            }

            case "payment.failed": {
                const failedPayment = event.payload?.payment?.entity;
                if (failedPayment) {
                    await supabase
                        .from("payments")
                        .update({
                            razorpay_payment_id: failedPayment.id,
                            status: "failed",
                        })
                        .eq("razorpay_order_id", failedPayment.order_id);
                }
                break;
            }

            case "subscription.charged": {
                const subscription = event.payload?.subscription?.entity;
                if (subscription) {
                    await supabase
                        .from("users")
                        .update({
                            subscription_status: "active",
                            subscription_end_date: new Date(
                                subscription.current_end * 1000
                            ).toISOString(),
                        })
                        .eq("razorpay_subscription_id", subscription.id);
                }
                break;
            }

            case "subscription.cancelled": {
                const cancelledSub = event.payload?.subscription?.entity;
                if (cancelledSub) {
                    await supabase
                        .from("users")
                        .update({
                            subscription_status: "cancelled",
                        })
                        .eq("razorpay_subscription_id", cancelledSub.id);
                }
                break;
            }

            default:
                console.log("Unhandled webhook event:", eventType);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
