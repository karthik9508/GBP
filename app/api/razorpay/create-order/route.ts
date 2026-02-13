import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";

const PLAN_PRICES: Record<string, number> = {
    starter: 29900,  // ₹299 in paise
    pro: 59900,      // ₹599 in paise
    lifetime: 999900, // ₹9,999 in paise
};

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planType } = await request.json();

        if (!planType || !PLAN_PRICES[planType]) {
            return NextResponse.json(
                { error: "Invalid plan type. Choose: starter, pro, or lifetime" },
                { status: 400 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const amount = PLAN_PRICES[planType];

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `gbp_${planType}_${Date.now()}`,
            notes: {
                user_id: user.id,
                plan_type: planType,
                user_email: user.email || "",
            },
        });

        // Save payment record
        await supabase.from("payments").insert({
            user_id: user.id,
            razorpay_order_id: order.id,
            amount,
            currency: "INR",
            status: "created",
            plan_type: planType,
            email: user.email,
        });

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("Razorpay order creation error:", err);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
