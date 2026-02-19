"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompetitorInfo } from "@/types";

interface CompetitorComparisonProps {
    competitors: CompetitorInfo[];
    comparison: {
        yourRating: number;
        avgRating: number;
        yourReviews: number;
        avgReviews: number;
        yourPhotos: number;
        avgPhotos: number;
        ratingRank: number;
        reviewRank: number;
        photoRank: number;
    };
    insights: string[];
    businessName: string;
}

export function CompetitorComparison({ competitors, comparison, insights, businessName }: CompetitorComparisonProps) {
    const getRankBadge = (rank: number, total: number) => {
        if (rank === 1) return <Badge className="bg-amber-500 text-white text-[10px]">🥇 #1</Badge>;
        if (rank === 2) return <Badge className="bg-gray-400 text-white text-[10px]">🥈 #{rank}</Badge>;
        if (rank <= Math.ceil(total / 2)) return <Badge variant="secondary" className="text-[10px]">#{rank}</Badge>;
        return <Badge variant="destructive" className="text-[10px]">#{rank}</Badge>;
    };

    const total = competitors.length + 1; // Including "you"

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    🏆 Competitor Comparison
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    How you stack up against {competitors.length} nearby competitors
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Your Rankings */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/40">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            {getRankBadge(comparison.ratingRank, total)}
                        </div>
                        <p className="text-xl font-bold">{comparison.yourRating.toFixed(1)}</p>
                        <p className="text-[10px] text-muted-foreground">
                            vs avg {comparison.avgRating.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/40">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            {getRankBadge(comparison.reviewRank, total)}
                        </div>
                        <p className="text-xl font-bold">{comparison.yourReviews}</p>
                        <p className="text-[10px] text-muted-foreground">
                            vs avg {comparison.avgReviews}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Reviews</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/40">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            {getRankBadge(comparison.photoRank, total)}
                        </div>
                        <p className="text-xl font-bold">{comparison.yourPhotos}</p>
                        <p className="text-[10px] text-muted-foreground">
                            vs avg {comparison.avgPhotos}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Photos</p>
                    </div>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-3">
                    {[
                        { label: "Rating", yours: comparison.yourRating, avg: comparison.avgRating, max: 5, format: (v: number) => v.toFixed(1) },
                        { label: "Reviews", yours: comparison.yourReviews, avg: comparison.avgReviews, max: Math.max(comparison.yourReviews, comparison.avgReviews, 100), format: (v: number) => String(v) },
                        { label: "Photos", yours: comparison.yourPhotos, avg: comparison.avgPhotos, max: Math.max(comparison.yourPhotos, comparison.avgPhotos, 30), format: (v: number) => String(v) },
                    ].map(metric => (
                        <div key={metric.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium">{metric.label}</span>
                                <span className="text-muted-foreground">
                                    You: {metric.format(metric.yours)} | Avg: {metric.format(metric.avg)}
                                </span>
                            </div>
                            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                {/* Average bar (background) */}
                                <div
                                    className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full"
                                    style={{ width: `${(metric.avg / metric.max) * 100}%` }}
                                />
                                {/* Your bar (foreground) */}
                                <div
                                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${metric.yours >= metric.avg
                                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                            : "bg-gradient-to-r from-amber-500 to-orange-400"
                                        }`}
                                    style={{ width: `${(metric.yours / metric.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Competitor List */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-muted/50 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <span>Business</span>
                        <span className="text-center">Rating</span>
                        <span className="text-center">Reviews</span>
                        <span className="text-center">Photos</span>
                    </div>
                    {/* Your business (highlighted) */}
                    <div className="grid grid-cols-4 gap-2 px-3 py-2.5 bg-primary/5 border-l-2 border-primary">
                        <span className="text-xs font-medium truncate">📍 {businessName}</span>
                        <span className="text-xs text-center font-medium">{comparison.yourRating.toFixed(1)} ⭐</span>
                        <span className="text-xs text-center font-medium">{comparison.yourReviews}</span>
                        <span className="text-xs text-center font-medium">{comparison.yourPhotos}</span>
                    </div>
                    {/* Competitors */}
                    {competitors.map((comp, idx) => (
                        <div key={comp.placeId} className="grid grid-cols-4 gap-2 px-3 py-2.5 border-t">
                            <span className="text-xs text-muted-foreground truncate">
                                {idx + 1}. {comp.name}
                            </span>
                            <span className="text-xs text-center">{comp.rating?.toFixed(1) || "—"}</span>
                            <span className="text-xs text-center">{comp.reviewCount}</span>
                            <span className="text-xs text-center">{comp.photoCount}</span>
                        </div>
                    ))}
                </div>

                {/* Insights */}
                {insights.length > 0 && (
                    <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Insights</h4>
                        {insights.map((insight, i) => (
                            <p key={i} className="text-xs p-2 rounded bg-muted/30">
                                {insight}
                            </p>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
