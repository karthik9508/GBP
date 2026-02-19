"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PremiumChecklistItem } from "@/types";

interface CategoryScore {
    passed: number;
    total: number;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
    basic_info: { label: "Basic Information", icon: "📋" },
    contact: { label: "Contact & Access", icon: "📞" },
    visual: { label: "Visual Content", icon: "📸" },
    content: { label: "Posts & Content", icon: "📝" },
    reviews: { label: "Reviews", icon: "⭐" },
    engagement: { label: "Engagement", icon: "💬" },
    seo: { label: "SEO & Discovery", icon: "🔍" },
    technical: { label: "Technical", icon: "⚙️" },
};

interface PremiumChecklistProps {
    items: PremiumChecklistItem[];
    passedCount: number;
    totalCount: number;
    categoryScores: Record<string, CategoryScore>;
}

export function PremiumChecklist({ items, passedCount, totalCount, categoryScores }: PremiumChecklistProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [showFixGuide, setShowFixGuide] = useState<string | null>(null);

    const categories = Object.keys(categoryScores);
    const percentage = Math.round((passedCount / totalCount) * 100);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        ⭐ 47-Point Audit Checklist
                    </CardTitle>
                    <div className="text-right">
                        <span className={`text-2xl font-bold ${percentage >= 70 ? "text-emerald-500" : percentage >= 40 ? "text-amber-500" : "text-red-500"}`}>
                            {passedCount}/{totalCount}
                        </span>
                        <p className="text-xs text-muted-foreground">points passed</p>
                    </div>
                </div>
                {/* Overall progress bar */}
                <div className="h-3 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? "bg-emerald-500" : percentage >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {categories.map(cat => {
                    const meta = CATEGORY_META[cat] || { label: cat, icon: "📋" };
                    const score = categoryScores[cat];
                    const catPct = Math.round((score.passed / score.total) * 100);
                    const isExpanded = expandedCategory === cat;
                    const catItems = items.filter(i => i.category === cat);

                    return (
                        <div key={cat} className="border rounded-lg overflow-hidden">
                            {/* Category header */}
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                            >
                                <span className="text-lg">{meta.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{meta.label}</span>
                                        <Badge
                                            variant={catPct >= 70 ? "secondary" : catPct >= 40 ? "warning" : "destructive"}
                                            className="text-xs"
                                        >
                                            {score.passed}/{score.total}
                                        </Badge>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${catPct >= 70 ? "bg-emerald-500" : catPct >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                            style={{ width: `${catPct}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-muted-foreground text-sm">
                                    {isExpanded ? "▲" : "▼"}
                                </span>
                            </button>

                            {/* Expanded checklist items */}
                            {isExpanded && (
                                <div className="border-t divide-y">
                                    {catItems.map(item => (
                                        <div key={item.id} className="px-3 py-2.5">
                                            <div className="flex items-start gap-2.5">
                                                <span className="text-base mt-0.5">
                                                    {item.passed ? "✅" : "❌"}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-sm ${item.passed ? "text-muted-foreground" : "font-medium"}`}>
                                                            {item.label}
                                                        </span>
                                                        {!item.passed && (
                                                            <Badge
                                                                variant={item.weight === "critical" ? "destructive" : item.weight === "important" ? "warning" : "secondary"}
                                                                className="text-[10px] px-1.5 py-0"
                                                            >
                                                                {item.weight}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Fix guide toggle */}
                                                    {!item.passed && (
                                                        <div className="mt-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowFixGuide(showFixGuide === item.id ? null : item.id);
                                                                }}
                                                                className="text-xs text-primary hover:underline"
                                                            >
                                                                {showFixGuide === item.id ? "Hide fix guide" : "How to fix →"}
                                                            </button>
                                                            {showFixGuide === item.id && (
                                                                <div className="mt-1.5 p-2.5 rounded-md bg-primary/5 border border-primary/10">
                                                                    <p className="text-xs leading-relaxed">{item.fixGuide}</p>
                                                                    <p className="text-[10px] text-muted-foreground mt-1.5">
                                                                        ⏱ Estimated time: {item.estimatedTime}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
