"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FixStep {
    id: string;
    label: string;
    category: string;
    fixGuide: string;
    estimatedTime: string;
    impact: "critical" | "important" | "nice-to-have";
}

interface FixGuideProps {
    steps: FixStep[];
}

const CATEGORY_ICONS: Record<string, string> = {
    basic_info: "📋",
    contact: "📞",
    visual: "📸",
    content: "📝",
    reviews: "⭐",
    engagement: "💬",
    seo: "🔍",
    technical: "⚙️",
};

export function FixGuide({ steps }: FixGuideProps) {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const toggleStep = (id: string) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const completedCount = completedSteps.size;
    const totalSteps = steps.length;
    const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    // Calculate total estimated time
    const totalMinutes = steps.reduce((sum, step) => {
        const match = step.estimatedTime.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    const criticalSteps = steps.filter(s => s.impact === "critical");
    const importantSteps = steps.filter(s => s.impact === "important");
    const niceSteps = steps.filter(s => s.impact === "nice-to-have");

    const renderStepGroup = (groupSteps: FixStep[], groupLabel: string, badgeVariant: "destructive" | "warning" | "secondary") => {
        if (groupSteps.length === 0) return null;

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant={badgeVariant} className="text-[10px]">{groupLabel}</Badge>
                    <span className="text-xs text-muted-foreground">
                        {groupSteps.filter(s => completedSteps.has(s.id)).length}/{groupSteps.length} done
                    </span>
                </div>
                {groupSteps.map((step, idx) => {
                    const isCompleted = completedSteps.has(step.id);
                    const globalIdx = steps.indexOf(step) + 1;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isCompleted
                                    ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40 opacity-70"
                                    : "bg-background border-border hover:border-primary/30"
                                }`}
                        >
                            {/* Step number / checkbox */}
                            <button
                                onClick={() => toggleStep(step.id)}
                                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-xs font-bold transition-colors ${isCompleted
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary/10 text-primary hover:bg-primary/20"
                                    }`}
                            >
                                {isCompleted ? "✓" : globalIdx}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm">{CATEGORY_ICONS[step.category] || "📋"}</span>
                                    <span className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                        {step.label}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? "text-muted-foreground" : ""}`}>
                                    {step.fixGuide}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    ⏱ {step.estimatedTime}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        🛠️ Step-by-Step Fix Guide
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        ⏱ ~{totalMinutes} min total
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Follow these steps in order to maximize your GBP score. Click to mark as done.
                </p>

                {/* Progress */}
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <span className="text-xs font-medium shrink-0">
                        {completedCount}/{totalSteps}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {renderStepGroup(criticalSteps, "🚨 Critical — Fix First", "destructive")}
                {renderStepGroup(importantSteps, "⚡ Important", "warning")}
                {renderStepGroup(niceSteps, "💡 Nice to Have", "secondary")}

                {completedCount === totalSteps && totalSteps > 0 && (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                        <span className="text-3xl">🎉</span>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-1">
                            All steps completed! Re-run your audit to see the improved score.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
