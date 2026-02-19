"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./ScoreGauge";
import { PremiumChecklist } from "./PremiumChecklist";
import { CompetitorComparison } from "./CompetitorComparison";
import { KeywordSuggestions } from "./KeywordSuggestions";
import { ReviewSentiment } from "./ReviewSentiment";
import { FixGuide } from "./FixGuide";
import type { AuditResult, PremiumAuditResult } from "@/types";

interface AuditResultsProps {
    result: AuditResult;
}

export function AuditResults({ result }: AuditResultsProps) {
    const getScoreLabel = (score: number) => {
        if (score >= 80) return { label: "Excellent", emoji: "🏆", color: "text-emerald-500" };
        if (score >= 65) return { label: "Good", emoji: "👍", color: "text-emerald-400" };
        if (score >= 50) return { label: "Average", emoji: "⚡", color: "text-amber-500" };
        if (score >= 35) return { label: "Needs Work", emoji: "⚠️", color: "text-orange-500" };
        return { label: "Critical", emoji: "🚨", color: "text-red-500" };
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return <Badge variant="destructive">High Priority</Badge>;
            case "medium":
                return <Badge variant="warning">Medium</Badge>;
            default:
                return <Badge variant="secondary">Low</Badge>;
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case "profile": return "👤";
            case "content": return "📝";
            case "engagement": return "💬";
            default: return "📋";
        }
    };

    const scoreInfo = getScoreLabel(result.score);

    // Profile checklist items derived from the data
    const profileItems = [
        { label: "Business Name", present: !!result.businessName, icon: "🏪" },
        { label: "Address", present: !!result.address, icon: "📍" },
        { label: "Phone Number", present: !!result.hasPhone, icon: "📞" },
        { label: "Website", present: !!result.hasWebsite, icon: "🌐" },
        { label: "Business Hours", present: !!result.hasHours, icon: "🕐" },
    ];

    const highIssues = result.issues.filter(i => i.severity === "high");
    const mediumIssues = result.issues.filter(i => i.severity === "medium");
    const lowIssues = result.issues.filter(i => i.severity === "low");

    // Calculate category percentages for visual display
    const profilePct = Math.round((result.profileComplete / 35) * 100);
    const contentPct = Math.round((result.contentActivity / 35) * 100);
    const engagementPct = Math.round((result.engagement / 30) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

            {/* ===== Business Info Header ===== */}
            {result.businessName && (
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                                <h2 className="text-xl font-bold">{result.businessName}</h2>
                                {result.address && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        📍 {result.address}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    {result.rating && (
                                        <span className="text-sm font-medium flex items-center gap-1">
                                            ⭐ {result.rating.toFixed(1)}
                                            {result.reviewCount !== undefined && (
                                                <span className="text-muted-foreground font-normal">
                                                    ({result.reviewCount} reviews)
                                                </span>
                                            )}
                                        </span>
                                    )}
                                    {result.photoCount !== undefined && result.photoCount > 0 && (
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            📸 {result.photoCount} photos
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className={`text-3xl font-bold ${scoreInfo.color}`}>
                                    {result.score}
                                </span>
                                <span className="text-lg text-muted-foreground">/100</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ===== Overall Score with Gauge ===== */}
            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <ScoreGauge score={result.score} />
                        <div className="text-center sm:text-left flex-1">
                            <h2 className={`text-3xl font-bold ${scoreInfo.color}`}>
                                {scoreInfo.emoji} {scoreInfo.label}
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Your GBP profile scored <strong>{result.score}/100</strong>.
                                {result.score >= 80 && " Your listing is well-optimized and performing strong."}
                                {result.score >= 50 && result.score < 80 && " There are several areas where improvements can boost your visibility."}
                                {result.score < 50 && " Your listing needs significant attention to rank well in local search results."}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {highIssues.length > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                        {highIssues.length} critical issue{highIssues.length > 1 ? "s" : ""}
                                    </Badge>
                                )}
                                {mediumIssues.length > 0 && (
                                    <Badge variant="warning" className="text-xs">
                                        {mediumIssues.length} improvement{mediumIssues.length > 1 ? "s" : ""}
                                    </Badge>
                                )}
                                {result.issues.length === 0 && (
                                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">
                                        ✅ No issues found
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ===== Category Breakdown ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Profile Completeness */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                                👤 Profile
                            </span>
                            <span className={`text-lg font-bold ${profilePct >= 70 ? "text-emerald-500" : profilePct >= 40 ? "text-amber-500" : "text-red-500"}`}>
                                {result.profileComplete}/35
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${profilePct}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {profilePct >= 80 ? "Profile is well-completed" : profilePct >= 50 ? "Some fields are missing" : "Many fields incomplete"}
                        </p>
                    </CardContent>
                </Card>

                {/* Content Activity */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                                📝 Content
                            </span>
                            <span className={`text-lg font-bold ${contentPct >= 70 ? "text-emerald-500" : contentPct >= 40 ? "text-amber-500" : "text-red-500"}`}>
                                {result.contentActivity}/35
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${contentPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {contentPct >= 80 ? "Great content activity" : contentPct >= 40 ? "Could post more frequently" : "Very low content activity"}
                        </p>
                    </CardContent>
                </Card>

                {/* Engagement */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                                💬 Engagement
                            </span>
                            <span className={`text-lg font-bold ${engagementPct >= 70 ? "text-emerald-500" : engagementPct >= 40 ? "text-amber-500" : "text-red-500"}`}>
                                {result.engagement}/30
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${engagementPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {engagementPct >= 80 ? "Strong customer engagement" : engagementPct >= 40 ? "Review response rate could improve" : "Low engagement — need more reviews"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ===== Profile Completeness Checklist ===== */}
            {result.businessName && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            📋 Profile Checklist
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Google rewards complete profiles with higher local rankings.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {profileItems.map((item) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg text-sm transition-colors ${item.present
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                                        : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    <span className="text-base">{item.present ? "✅" : "❌"}</span>
                                    <span className="font-medium">{item.icon} {item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ===== Listing Analysis ===== */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        📊 Listing Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Reviews & Rating Analysis */}
                    <div className="p-4 rounded-lg bg-muted/40 space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">💬 Reviews & Rating</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-2xl font-bold">
                                    {result.rating ? `${result.rating.toFixed(1)} ⭐` : "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">Average Rating</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {result.reviewCount !== undefined ? result.reviewCount : "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">Total Reviews</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {result.rating && result.rating >= 4.5
                                ? "🟢 Excellent rating! Maintain quality to keep reviews high."
                                : result.rating && result.rating >= 4.0
                                    ? "🟡 Good rating. Aim for 4.5+ by improving customer experience."
                                    : result.rating && result.rating >= 3.0
                                        ? "🟠 Average rating. Focus on resolving negative feedback quickly."
                                        : result.rating
                                            ? "🔴 Low rating. Prioritize customer satisfaction and respond to all reviews."
                                            : "No rating data available."}
                        </p>
                    </div>

                    {/* Photos & Content */}
                    <div className="p-4 rounded-lg bg-muted/40 space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">📸 Photos & Visual Content</h4>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-2xl font-bold">
                                    {result.photoCount !== undefined ? result.photoCount : "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">Photos</p>
                            </div>
                            <div className="flex-1">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${Math.min(((result.photoCount || 0) / 20) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Target: 20+ photos for best results
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {(result.photoCount || 0) >= 20
                                ? "🟢 Great photo count! Keep adding fresh photos monthly."
                                : (result.photoCount || 0) >= 10
                                    ? "🟡 Good start. Add more interior, team, and product photos."
                                    : (result.photoCount || 0) >= 1
                                        ? "🟠 Too few photos. Listings with 20+ photos get 35% more clicks."
                                        : "🔴 No photos! Add exterior, interior, team, and product photos immediately."}
                        </p>
                    </div>

                    {/* Online Presence */}
                    <div className="p-4 rounded-lg bg-muted/40 space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">🌐 Online Presence</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2 rounded-lg bg-background/60">
                                <p className="text-xl">{result.hasWebsite ? "✅" : "❌"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Website</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-background/60">
                                <p className="text-xl">{result.hasPhone ? "✅" : "❌"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Phone</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-background/60">
                                <p className="text-xl">{result.hasHours ? "✅" : "❌"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Hours</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ===== Issues Found ===== */}
            {result.issues.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            🔍 Issues Found
                            <Badge variant="secondary" className="text-xs font-normal">
                                {result.issues.length} total
                            </Badge>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Fix high-priority issues first for the biggest ranking improvement.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {/* High priority first, then medium, then low */}
                        {[...highIssues, ...mediumIssues, ...lowIssues].map((issue, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${issue.severity === "high"
                                    ? "border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10"
                                    : issue.severity === "medium"
                                        ? "border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10"
                                        : "border-muted bg-muted/30"
                                    }`}
                            >
                                <span className="text-base mt-0.5">{getCategoryIcon(issue.category)}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-medium">{issue.message}</p>
                                        {getSeverityBadge(issue.severity)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        💡 {issue.recommendation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* ===== Recommendations ===== */}
            {result.recommendations.length > 0 && (
                <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            🚀 Action Plan
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Follow these steps to improve your GBP ranking and get more customers.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {result.recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <p className="text-sm">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ===== PREMIUM SECTIONS ===== */}
            {result.isPremium ? (
                <>
                    {/* Premium badge */}
                    <div className="flex items-center gap-2 -mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        <Badge className="bg-primary text-primary-foreground text-xs">⭐ Premium Analysis</Badge>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>

                    {/* 47-Point Checklist */}
                    <PremiumChecklist
                        items={(result as PremiumAuditResult).checklist.items}
                        passedCount={(result as PremiumAuditResult).checklist.passedCount}
                        totalCount={(result as PremiumAuditResult).checklist.totalCount}
                        categoryScores={(result as PremiumAuditResult).checklist.categoryScores}
                    />

                    {/* Fix Guide */}
                    <FixGuide steps={(result as PremiumAuditResult).fixGuide} />

                    {/* Competitor Comparison */}
                    <CompetitorComparison
                        competitors={(result as PremiumAuditResult).competitors.competitors}
                        comparison={(result as PremiumAuditResult).competitors.comparison}
                        insights={(result as PremiumAuditResult).competitors.insights}
                        businessName={result.businessName || "Your Business"}
                    />

                    {/* Review Sentiment */}
                    <ReviewSentiment {...(result as PremiumAuditResult).reviewSentiment} />

                    {/* Keyword Suggestions */}
                    <KeywordSuggestions {...(result as PremiumAuditResult).keywordSuggestions} />
                </>
            ) : (
                /* Blurred premium preview for free users */
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex flex-col items-center justify-center p-6">
                        <span className="text-3xl mb-2">🔒</span>
                        <h3 className="text-lg font-bold">Premium Audit Features</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
                            Get 47-point checklist, competitor comparison, keyword optimization, review sentiment analysis, and step-by-step fix guide.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center">
                            <Badge variant="secondary" className="text-xs">⭐ 47-Point Checklist</Badge>
                            <Badge variant="secondary" className="text-xs">🏆 Competitor Analysis</Badge>
                            <Badge variant="secondary" className="text-xs">🔑 Keywords</Badge>
                            <Badge variant="secondary" className="text-xs">💭 Sentiment</Badge>
                            <Badge variant="secondary" className="text-xs">🛠️ Fix Guide</Badge>
                        </div>
                    </div>
                    <CardContent className="p-6 opacity-30 pointer-events-none select-none">
                        <div className="space-y-4">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="grid grid-cols-3 gap-3">
                                <div className="h-20 bg-muted rounded" />
                                <div className="h-20 bg-muted rounded" />
                                <div className="h-20 bg-muted rounded" />
                            </div>
                            <div className="h-4 bg-muted rounded w-2/3" />
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/3" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ===== GBP Pro CTA ===== */}
            {!result.isPremium && (
                <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-bold">
                            Want to fix these issues automatically?
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            GBP Pro schedules posts, generates AI review replies, and monitors your listing 24/7.
                        </p>
                        <div className="flex justify-center gap-3 mt-4 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs bg-background/80 rounded-full px-3 py-1">
                                ✅ Auto post scheduling
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs bg-background/80 rounded-full px-3 py-1">
                                ✅ AI review replies
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs bg-background/80 rounded-full px-3 py-1">
                                ✅ Audit monitoring
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
