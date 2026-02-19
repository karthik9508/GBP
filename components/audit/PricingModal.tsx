"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
    prefill?: { email?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open: () => void;
}

const PLANS = [
    {
        id: "monthly",
        name: "Monthly",
        price: 399,
        period: "/month",
        savings: null,
        features: [
            "47-Point GBP Checklist",
            "Competitor Analysis",
            "AI Keyword Suggestions",
            "Review Sentiment Analysis",
            "Step-by-Step Fix Guide",
            "Unlimited Premium Audits",
        ],
    },
    {
        id: "annual",
        name: "Annual",
        price: 1999,
        period: "/year",
        savings: "Save ₹2,789 (58% off)",
        featured: true,
        features: [
            "Everything in Monthly",
            "47-Point GBP Checklist",
            "Competitor Analysis",
            "AI Keyword Suggestions",
            "Review Sentiment Analysis",
            "Step-by-Step Fix Guide",
            "Priority Support",
        ],
    },
];

export function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
    const [selectedPlan, setSelectedPlan] = useState("annual");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        setError("");

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                setError("Failed to load payment gateway. Please try again.");
                setLoading(false);
                return;
            }

            // Create order
            const res = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planType: selectedPlan }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create order");
                setLoading(false);
                return;
            }

            // Open Razorpay checkout
            const options: RazorpayOptions = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "GBP Pro",
                description: `Pro ${selectedPlan === "annual" ? "Annual" : "Monthly"} Plan`,
                order_id: data.id,
                handler: async (response) => {
                    // Verify payment
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.verified) {
                            onSuccess();
                            onClose();
                        } else {
                            setError("Payment verification failed. Contact support.");
                        }
                    } catch {
                        setError("Payment verification failed. Please contact support.");
                    }
                    setLoading(false);
                },
                theme: { color: "#6366f1" },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-6 text-center border-b">
                    <h2 className="text-2xl font-bold">Upgrade to GBP Pro ⭐</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Unlock powerful audit features to dominate local search
                    </p>
                </div>

                {/* Plans */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PLANS.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`cursor-pointer transition-all relative ${selectedPlan === plan.id
                                    ? "border-2 border-primary shadow-lg shadow-primary/10"
                                    : "border-2 border-transparent hover:border-primary/30"
                                    }`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.featured && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground text-xs px-3">
                                            Best Value
                                        </Badge>
                                    </div>
                                )}
                                <CardContent className="p-5">
                                    {/* Radio indicator */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id
                                            ? "border-primary"
                                            : "border-muted-foreground/40"
                                            }`}>
                                            {selectedPlan === plan.id && (
                                                <div className="w-3 h-3 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <span className="font-semibold text-lg">{plan.name}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-3">
                                        <span className="text-3xl font-bold">₹{plan.price}</span>
                                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                                    </div>

                                    {plan.savings && (
                                        <Badge variant="secondary" className="mb-3 text-xs bg-emerald-500/10 text-emerald-600">
                                            {plan.savings}
                                        </Badge>
                                    )}

                                    {/* Features */}
                                    <ul className="space-y-1.5">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                                <span className="text-emerald-500 text-xs">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-2 mt-4">
                            {error}
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            className="flex-1"
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                `Pay ₹${PLANS.find(p => p.id === selectedPlan)?.price} →`
                            )}
                        </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span>🔒 Secure Payment</span>
                        <span>•</span>
                        <span>⚡ Instant Access</span>
                        <span>•</span>
                        <span>🔄 Cancel Anytime</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
