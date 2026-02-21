"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ReportData {
    hasData: boolean;
    message?: string;
    latest?: {
        id: string;
        businessName: string;
        overallScore: number;
        profileComplete: number;
        contentActivity: number;
        engagement: number;
        createdAt: string;
    };
    previous?: {
        overallScore: number;
        profileComplete: number;
        contentActivity: number;
        engagement: number;
    } | null;
    status?: { label: string; description: string };
    improvements?: {
        area: string;
        score: number;
        maxScore: number;
        priority: "high" | "medium" | "low";
        tips: string[];
    }[];
    issues?: string[];
    history?: { date: string; score: number; businessName: string }[];
    totalAudits?: number;
}

function getScoreColor(score: number, max: number) {
    const pct = (score / max) * 100;
    if (pct >= 80) return "text-emerald-600";
    if (pct >= 60) return "text-amber-600";
    return "text-red-600";
}

function getScoreBg(score: number, max: number) {
    const pct = (score / max) * 100;
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-amber-500";
    return "bg-red-500";
}

function getStatusBadge(label: string) {
    switch (label) {
        case "Excellent": return "success";
        case "Good": return "secondary";
        case "Needs Work": return "warning";
        case "Critical": return "destructive";
        default: return "secondary";
    }
}

function getTrend(current: number, previous: number | undefined) {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff > 0) return { icon: "📈", text: `+${diff}`, color: "text-emerald-600" };
    if (diff < 0) return { icon: "📉", text: `${diff}`, color: "text-red-600" };
    return { icon: "➡️", text: "0", color: "text-muted-foreground" };
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case "high": return "bg-red-500/10 border-red-500/20 text-red-700";
        case "medium": return "bg-amber-500/10 border-amber-500/20 text-amber-700";
        case "low": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700";
        default: return "bg-muted";
    }
}

function getPriorityBadge(priority: string): "destructive" | "warning" | "success" {
    switch (priority) {
        case "high": return "destructive";
        case "medium": return "warning";
        default: return "success";
    }
}

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reports")
            .then((res) => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-foreground">Loading your report...</p>
                </div>
            </div>
        );
    }

    if (!data?.hasData) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Improvement suggestions based on your audit results.
                    </p>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="text-5xl mb-4">📊</span>
                        <h3 className="text-lg font-semibold">No Reports Yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            Run your first GBP audit to receive personalized improvement
                            suggestions and track your progress over time.
                        </p>
                        <Link href="/dashboard/audit">
                            <Button variant="gradient" className="mt-6">
                                Run Your First Audit →
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const latest = data.latest!;
    const status = data.status!;
    const improvements = data.improvements || [];
    const issues = data.issues || [];
    const history = data.history || [];

    const scoreTrend = getTrend(latest.overallScore, data.previous?.overallScore);
    const profileTrend = getTrend(latest.profileComplete, data.previous?.profileComplete);
    const contentTrend = getTrend(latest.contentActivity, data.previous?.contentActivity);
    const engagementTrend = getTrend(latest.engagement, data.previous?.engagement);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Improvement suggestions for{" "}
                        <span className="font-medium text-foreground">{latest.businessName}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadge(status.label) as "success" | "secondary" | "warning" | "destructive"}>
                        {status.label}
                    </Badge>
                    <Link href="/dashboard/audit">
                        <Button size="sm" variant="outline">🔄 Re-Audit</Button>
                    </Link>
                </div>
            </div>

            {/* Overall Score Card */}
            <Card className="overflow-hidden">
                <div className="gradient-primary p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Overall Score</p>
                            <div className="flex items-end gap-3 mt-1">
                                <span className="text-5xl font-bold">{latest.overallScore}</span>
                                <span className="text-blue-200 text-lg mb-1">/100</span>
                                {scoreTrend && (
                                    <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full mb-1">
                                        {scoreTrend.icon} {scoreTrend.text} from last audit
                                    </span>
                                )}
                            </div>
                            <p className="text-blue-100 text-sm mt-2">{status.description}</p>
                        </div>
                        <div className="hidden md:block text-8xl opacity-20">📊</div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Profile Score */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Profile Completeness</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${getScoreColor(latest.profileComplete, 35)}`}>
                                        {latest.profileComplete}/35
                                    </span>
                                    {profileTrend && (
                                        <span className={`text-xs ${profileTrend.color}`}>
                                            {profileTrend.text}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getScoreBg(latest.profileComplete, 35)}`}
                                    style={{ width: `${(latest.profileComplete / 35) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Content Score */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Content Activity</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${getScoreColor(latest.contentActivity, 35)}`}>
                                        {latest.contentActivity}/35
                                    </span>
                                    {contentTrend && (
                                        <span className={`text-xs ${contentTrend.color}`}>
                                            {contentTrend.text}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getScoreBg(latest.contentActivity, 35)}`}
                                    style={{ width: `${(latest.contentActivity / 35) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Engagement Score */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Engagement</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${getScoreColor(latest.engagement, 30)}`}>
                                        {latest.engagement}/30
                                    </span>
                                    {engagementTrend && (
                                        <span className={`text-xs ${engagementTrend.color}`}>
                                            {engagementTrend.text}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getScoreBg(latest.engagement, 30)}`}
                                    style={{ width: `${(latest.engagement / 30) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            {improvements.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        💡 Improvement Suggestions
                        <Badge variant="secondary">{improvements.length} areas</Badge>
                    </h2>

                    {improvements.map((imp, idx) => (
                        <Card key={idx} className={`border ${getPriorityColor(imp.priority)}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-3">
                                        <span className="text-xl">
                                            {imp.area === "Profile Completeness" && "👤"}
                                            {imp.area === "Content Activity" && "📝"}
                                            {imp.area === "Customer Engagement" && "💬"}
                                        </span>
                                        {imp.area}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            ({imp.score}/{imp.maxScore})
                                        </span>
                                    </CardTitle>
                                    <Badge variant={getPriorityBadge(imp.priority)}>
                                        {imp.priority} priority
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {imp.tips.map((tip, tipIdx) => (
                                        <li key={tipIdx} className="flex items-start gap-3 text-sm">
                                            <span className="text-primary mt-0.5 shrink-0">✦</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* All Good */}
            {improvements.length === 0 && (
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                    <CardContent className="flex items-center gap-4 py-6">
                        <span className="text-4xl">🎉</span>
                        <div>
                            <h3 className="font-semibold text-emerald-700">Great Job!</h3>
                            <p className="text-sm text-muted-foreground">
                                All areas are scoring above 80%. Keep maintaining your profile consistently.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Issues Found */}
            {issues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            ⚠️ Issues Found
                            <Badge variant="destructive">{issues.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {issues.map((issue, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                    <span className="text-red-500 mt-0.5 shrink-0">●</span>
                                    <span>{typeof issue === "string" ? issue : JSON.stringify(issue)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Score History */}
            {history.length > 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            📈 Score History
                            <Badge variant="secondary">{history.length} audits</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {history.slice().reverse().map((entry, idx) => {
                                const prev = idx > 0 ? history.slice().reverse()[idx - 1] : null;
                                const diff = prev ? entry.score - prev.score : null;
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getScoreBg(entry.score, 100)}`}>
                                                {entry.score}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{entry.businessName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(entry.date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {diff !== null && (
                                            <span className={`text-sm font-medium ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                                                {diff > 0 ? `↑ +${diff}` : diff < 0 ? `↓ ${diff}` : "→ 0"}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Last Audit Info */}
            <div className="text-center text-sm text-muted-foreground pb-4">
                Last audit: {new Date(latest.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                })} •{" "}
                <Link href="/dashboard/audit" className="text-primary hover:underline">
                    Run a new audit
                </Link>
            </div>
        </div>
    );
}
