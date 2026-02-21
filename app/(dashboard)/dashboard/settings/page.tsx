"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Business {
    id: string;
    name: string;
    address: string | null;
    gbp_location_id: string;
}

interface UserProfile {
    name: string;
    email: string;
    subscription_tier: string;
    subscription_status: string;
    subscription_end_date: string | null;
}

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    const gbpStatus = searchParams.get("gbp");
    const errorParam = searchParams.get("error");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch profile from dashboard API
            const dashRes = await fetch("/api/dashboard");
            const dashData = await dashRes.json();
            if (dashData.user) {
                setProfile({
                    name: dashData.user.name || "User",
                    email: dashData.user.email || "",
                    subscription_tier: dashData.subscription?.tier || "free",
                    subscription_status: dashData.subscription?.status || "active",
                    subscription_end_date: dashData.subscription?.endDate || null,
                });
            }
        } catch {
            // Non-critical — page still works
        } finally {
            setLoading(false);
        }
    };

    const handleConnectGBP = () => {
        setConnecting(true);
        window.location.href = "/api/auth/google";
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account, subscription, and connected services.
                </p>
            </div>

            {/* Connection Status Alerts */}
            {gbpStatus === "connected" && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="font-medium text-emerald-600">Google Business Profile Connected!</p>
                        <p className="text-sm text-muted-foreground">
                            Your scheduled posts will now auto-publish to your business profile.
                        </p>
                    </div>
                </div>
            )}

            {errorParam && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="font-medium text-destructive">Connection Failed</p>
                        <p className="text-sm text-muted-foreground">
                            {errorParam === "google_auth_failed" && "Google authorization was denied."}
                            {errorParam === "token_exchange_failed" && "Failed to exchange authorization token."}
                            {errorParam === "callback_failed" && "Something went wrong. Please try again."}
                            {!["google_auth_failed", "token_exchange_failed", "callback_failed"].includes(errorParam) && "An error occurred."}
                        </p>
                    </div>
                </div>
            )}

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                            {profile?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="font-semibold">{profile?.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email || ""}</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input defaultValue={profile?.name || ""} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input defaultValue={profile?.email || ""} disabled />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Subscription
                        <Badge variant={profile?.subscription_tier === "pro" ? "success" : "secondary"}>
                            {profile?.subscription_tier === "pro" ? "Pro Plan" : "Free Plan"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">
                                    {profile?.subscription_tier === "pro" ? "Pro Plan" : "Free Plan"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {profile?.subscription_tier === "pro"
                                        ? "Unlimited audits • AI recommendations • Auto-publish"
                                        : "1 audit • Basic recommendations"}
                                </p>
                            </div>
                            <p className="text-2xl font-bold">
                                {profile?.subscription_tier === "pro" ? "Pro ✨" : "₹0"}
                            </p>
                        </div>
                        {profile?.subscription_tier !== "pro" && (
                            <Button variant="gradient">Upgrade to Pro →</Button>
                        )}
                        {profile?.subscription_end_date && (
                            <p className="text-xs text-muted-foreground">
                                Renews on {new Date(profile.subscription_end_date).toLocaleDateString("en-IN")}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Connected Accounts — Google Business Profile */}
            <Card className={gbpStatus === "connected" ? "border-emerald-500/30" : ""}>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Connected Accounts
                        {businesses.length > 0 && (
                            <Badge variant="success">Connected</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🏢</span>
                            <div>
                                <p className="font-medium text-sm">Google Business Profile</p>
                                {loading ? (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <LoadingSpinner size="sm" /> Checking...
                                    </p>
                                ) : businesses.length > 0 ? (
                                    <p className="text-xs text-emerald-600">
                                        ✅ {businesses.length} location{businesses.length > 1 ? "s" : ""} connected
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Not connected — posts won't auto-publish to GBP
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant={businesses.length > 0 ? "outline" : "gradient"}
                            onClick={handleConnectGBP}
                            disabled={connecting}
                        >
                            {connecting ? (
                                <span className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" /> Connecting...
                                </span>
                            ) : businesses.length > 0 ? (
                                "Reconnect"
                            ) : (
                                "Connect"
                            )}
                        </Button>
                    </div>

                    {/* List connected businesses */}
                    {businesses.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Connected Locations</p>
                            {businesses.map((biz) => (
                                <div key={biz.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <span className="text-lg">📍</span>
                                    <div>
                                        <p className="text-sm font-medium">{biz.name}</p>
                                        {biz.address && (
                                            <p className="text-xs text-muted-foreground">{biz.address}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* How it works info */}
                    <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-4 space-y-2">
                        <p className="text-sm font-medium text-blue-600">How Auto-Publish Works</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>1. Connect your Google Business Profile above</li>
                            <li>2. Schedule posts from the Post Scheduler page</li>
                            <li>3. Posts auto-publish to your GBP at the scheduled time</li>
                            <li>4. Track status (scheduled / published / failed) in real-time</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Delete Account</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
