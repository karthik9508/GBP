"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewSentimentProps {
    overallSentiment: "positive" | "mixed" | "negative";
    sentimentScore: number;
    positiveThemes: string[];
    negativeThemes: string[];
    commonPraises: string[];
    commonComplaints: string[];
    suggestedResponses: { theme: string; response: string }[];
    summary: string;
}

export function ReviewSentiment({
    overallSentiment,
    sentimentScore,
    positiveThemes,
    negativeThemes,
    commonPraises,
    commonComplaints,
    suggestedResponses,
    summary,
}: ReviewSentimentProps) {
    const [expandedResponse, setExpandedResponse] = useState<number | null>(null);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const sentimentColor = overallSentiment === "positive"
        ? "text-emerald-500"
        : overallSentiment === "mixed"
            ? "text-amber-500"
            : "text-red-500";

    const sentimentEmoji = overallSentiment === "positive" ? "😊" : overallSentiment === "mixed" ? "😐" : "😟";
    const sentimentBarColor = overallSentiment === "positive"
        ? "bg-emerald-500"
        : overallSentiment === "mixed"
            ? "bg-amber-500"
            : "bg-red-500";

    const copyResponse = (text: string, idx: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        });
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    💭 Review Sentiment Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Sentiment Score */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40">
                    <div className="text-center">
                        <span className="text-4xl">{sentimentEmoji}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-lg font-bold capitalize ${sentimentColor}`}>
                                {overallSentiment}
                            </span>
                            <span className={`text-sm font-medium ${sentimentColor}`}>
                                {sentimentScore}/100
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${sentimentBarColor}`}
                                style={{ width: `${sentimentScore}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">{summary}</p>
                    </div>
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Positive Themes */}
                    <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/10">
                        <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                            👍 Positive Themes
                        </h4>
                        <div className="space-y-1">
                            {positiveThemes.map((theme, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-emerald-500 text-xs">●</span>
                                    <span className="text-xs">{theme}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Negative Themes */}
                    <div className="p-3 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10">
                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                            ⚠️ Areas to Improve
                        </h4>
                        <div className="space-y-1">
                            {negativeThemes.map((theme, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-red-500 text-xs">●</span>
                                    <span className="text-xs">{theme}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Common Praises & Complaints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Common Praises
                        </h4>
                        {commonPraises.map((praise, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs">
                                <span className="mt-0.5">🌟</span>
                                <span>{praise}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Common Complaints
                        </h4>
                        {commonComplaints.map((complaint, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs">
                                <span className="mt-0.5">📌</span>
                                <span>{complaint}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggested Responses */}
                {suggestedResponses.length > 0 && (
                    <div className="border-t pt-3 space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">
                            🤖 Suggested Response Templates
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Copy and customize these responses for common review themes.
                        </p>
                        {suggestedResponses.map((sr, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedResponse(expandedResponse === idx ? null : idx)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <span className="text-sm font-medium">
                                        {sr.theme}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {expandedResponse === idx ? "▲" : "▼"}
                                    </span>
                                </button>
                                {expandedResponse === idx && (
                                    <div className="px-3 pb-3 border-t">
                                        <div className="mt-2 p-2.5 rounded-md bg-primary/5 text-xs leading-relaxed">
                                            {sr.response}
                                        </div>
                                        <button
                                            onClick={() => copyResponse(sr.response, idx)}
                                            className="mt-1.5 text-[10px] text-primary hover:underline"
                                        >
                                            {copiedIdx === idx ? "✅ Copied!" : "📋 Copy response"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pro tip */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs">
                        <strong>💡 Pro Tip:</strong> Responding to negative reviews within 24 hours can improve your rating by up to 0.3 points. Use GBP Pro&apos;s AI to generate instant, professional responses.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
