import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";

const PLAN_PRICES: Record<string, { amount: number; label: string; duration: number }> = {
    monthly: { amount: 39900, label: "Pro Monthly", duration: 30 },     // ₹399
    annual: { amount: 199900, label: "Pro Annual", duration: 365 },    // ₹1,999
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
                { error: "Invalid plan type. Choose: monthly or annual" },
                { status: 400 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const plan = PLAN_PRICES[planType];

        const order = await razorpay.orders.create({
            amount: plan.amount,
            currency: "INR",
            receipt: `gbp_${planType}_${Date.now()}`,
            notes: {
                user_id: user.id,
                plan_type: planType,
                plan_label: plan.label,
                duration_days: String(plan.duration),
                user_email: user.email || "",
            },
        });

        // Save payment record
        await supabase.from("payments").insert({
            user_id: user.id,
            razorpay_order_id: order.id,
            amount: plan.amount,
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
