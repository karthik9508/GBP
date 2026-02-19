"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface DashboardData {
    stats: {
        totalAudits: number;
        latestScore: number | null;
        scoreTrend: number | null;
        issueCount: number;
    };
    subscription: {
        tier: string;
        status: string;
        expiresAt: string | null;
    };
    user: {
        name: string;
        email: string;
    };
    recentAudits: {
        id: string;
        businessName: string;
        score: number;
        profileComplete: number;
        contentActivity: number;
        engagement: number;
        issueCount: number;
        createdAt: string;
    }[];
}

function getScoreColor(score: number) {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
}

function getScoreBg(score: number) {
    if (score >= 80) return "bg-emerald-500/10";
    if (score >= 60) return "bg-amber-500/10";
    return "bg-red-500/10";
}

function getScoreLabel(score: number) {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/dashboard")
            .then((r) => r.json())
            .then((d) => {
                if (d.error) setError(d.error);
                else setData(d);
            })
            .catch(() => setError("Failed to load dashboard"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center space-y-4">
                        <span className="text-4xl">⚠️</span>
                        <p className="text-destructive font-medium">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const d = data!;
    const isPro = ["pro", "lifetime"].includes(d.subscription.tier) && d.subscription.status === "active";

    const statsCards = [
        {
            label: "Total Audits",
            value: String(d.stats.totalAudits),
            icon: "📊",
            trend: d.stats.totalAudits === 0 ? "Run your first audit" : `${d.stats.totalAudits} report${d.stats.totalAudits > 1 ? "s" : ""} generated`,
        },
        {
            label: "Latest Score",
            value: d.stats.latestScore !== null ? String(d.stats.latestScore) : "—",
            icon: "🔍",
            trend: d.stats.latestScore !== null ? getScoreLabel(d.stats.latestScore) : "No audits yet",
            color: d.stats.latestScore !== null ? getScoreColor(d.stats.latestScore) : undefined,
        },
        {
            label: "Score Trend",
            value: d.stats.scoreTrend !== null
                ? (d.stats.scoreTrend >= 0 ? `+${d.stats.scoreTrend}` : String(d.stats.scoreTrend))
                : "—",
            icon: d.stats.scoreTrend !== null ? (d.stats.scoreTrend >= 0 ? "📈" : "📉") : "📈",
            trend: d.stats.scoreTrend !== null ? "vs previous audit" : "Need 2+ audits",
            color: d.stats.scoreTrend !== null
                ? (d.stats.scoreTrend >= 0 ? "text-emerald-500" : "text-red-500")
                : undefined,
        },
        {
            label: "Subscription",
            value: isPro ? "Pro" : "Free",
            icon: isPro ? "⭐" : "🆓",
            trend: isPro
                ? (d.subscription.expiresAt
                    ? `Expires ${new Date(d.subscription.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                    : "Active")
                : "Upgrade to unlock premium",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back{d.user.name ? `, ${d.user.name.split(" ")[0]}` : ""}! Here&apos;s your GBP overview.
                </p>
            </div>

            {/* Subscription Banner for free users */}
            {!isPro && (
                <div className="rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⭐</span>
                        <div>
                            <p className="font-semibold text-sm">Upgrade to Pro</p>
                            <p className="text-xs text-muted-foreground">
                                Unlock premium audits with competitor analysis, AI keywords, and more — starting ₹399/month
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/audit">
                        <Button variant="gradient" size="sm">Upgrade</Button>
                    </Link>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <span className="text-2xl">{stat.icon}</span>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${stat.color || ""}`}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Audit Reports */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Audit Reports</CardTitle>
                    <Link href="/dashboard/audit">
                        <Button variant="outline" size="sm">Run New Audit</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {d.recentAudits.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <span className="text-5xl">🔍</span>
                            <div>
                                <p className="font-medium">No audits yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Run your first GBP audit to see results here
                                </p>
                            </div>
                            <Link href="/dashboard/audit">
                                <Button variant="gradient">Run Your First Audit →</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Business</th>
                                        <th className="pb-3 pr-4">Score</th>
                                        <th className="pb-3 pr-4 hidden sm:table-cell">Profile</th>
                                        <th className="pb-3 pr-4 hidden sm:table-cell">Content</th>
                                        <th className="pb-3 pr-4 hidden sm:table-cell">Engagement</th>
                                        <th className="pb-3 pr-4">Issues</th>
                                        <th className="pb-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {d.recentAudits.map((audit) => (
                                        <tr key={audit.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="py-3 pr-4">
                                                <div className="font-medium text-sm truncate max-w-[180px]">
                                                    {audit.businessName}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getScoreBg(audit.score)} ${getScoreColor(audit.score)}`}>
                                                        {audit.score}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 hidden sm:table-cell">
                                                <span className="text-sm text-muted-foreground">{audit.profileComplete}/35</span>
                                            </td>
                                            <td className="py-3 pr-4 hidden sm:table-cell">
                                                <span className="text-sm text-muted-foreground">{audit.contentActivity}/35</span>
                                            </td>
                                            <td className="py-3 pr-4 hidden sm:table-cell">
                                                <span className="text-sm text-muted-foreground">{audit.engagement}/30</span>
                                            </td>
                                            <td className="py-3 pr-4">
                                                {audit.issueCount > 0 ? (
                                                    <Badge variant="warning" className="text-xs">
                                                        {audit.issueCount} issue{audit.issueCount > 1 ? "s" : ""}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="success" className="text-xs">
                                                        All clear
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDate(audit.createdAt)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/audit">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    🔍
                                </div>
                                <div>
                                    <h3 className="font-semibold">Run Audit</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Check your profile health score
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/scheduler">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    📅
                                </div>
                                <div>
                                    <h3 className="font-semibold">Schedule a Post</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create and schedule your next GBP post
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/reviews">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    ⭐
                                </div>
                                <div>
                                    <h3 className="font-semibold">Respond to Reviews</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Manage and respond to customer reviews
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
