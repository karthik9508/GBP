import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing payment verification fields" },
                { status: 400 }
            );
        }

        // Verify Razorpay signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Update payment record
        const { data: payment } = await supabase
            .from("payments")
            .update({
                razorpay_payment_id,
                razorpay_signature,
                status: "captured",
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (!payment) {
            return NextResponse.json(
                { error: "Payment record not found" },
                { status: 404 }
            );
        }

        // Upgrade user subscription
        const subscriptionEnd = payment.plan_type === "lifetime"
            ? null
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

        await supabase
            .from("users")
            .update({
                subscription_tier: payment.plan_type,
                subscription_status: "active",
                subscription_end_date: subscriptionEnd,
            })
            .eq("id", user.id);

        return NextResponse.json({
            verified: true,
            payment: {
                id: razorpay_payment_id,
                status: "captured",
                plan_type: payment.plan_type,
            },
        });
    } catch (err) {
        console.error("Payment verification error:", err);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
