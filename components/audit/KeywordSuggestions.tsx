"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeywordSuggestionsProps {
    primaryKeywords: string[];
    longTailKeywords: string[];
    localKeywords: string[];
    descriptionSuggestion: string;
    postKeywords: string[];
}

export function KeywordSuggestions({
    primaryKeywords,
    longTailKeywords,
    localKeywords,
    descriptionSuggestion,
    postKeywords,
}: KeywordSuggestionsProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const KeywordList = ({ keywords, label, field }: { keywords: string[]; label: string; field: string }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{label}</h4>
                <button
                    onClick={() => copyToClipboard(keywords.join(", "), field)}
                    className="text-[10px] text-primary hover:underline"
                >
                    {copiedField === field ? "✅ Copied!" : "Copy all"}
                </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, i) => (
                    <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                        onClick={() => copyToClipboard(kw, `${field}-${i}`)}
                    >
                        {copiedField === `${field}-${i}` ? "✅" : ""} {kw}
                    </Badge>
                ))}
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    🔑 Keyword Optimization
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Use these keywords in your GBP description, posts, and website for better local rankings.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <KeywordList keywords={primaryKeywords} label="🎯 Primary Keywords" field="primary" />

                <div className="border-t pt-3">
                    <KeywordList keywords={longTailKeywords} label="📏 Long-Tail Keywords" field="longtail" />
                </div>

                <div className="border-t pt-3">
                    <KeywordList keywords={localKeywords} label="📍 Local Keywords" field="local" />
                </div>

                <div className="border-t pt-3">
                    <KeywordList keywords={postKeywords} label="📱 Post Hashtags & Keywords" field="post" />
                </div>

                {/* Optimized Description */}
                {descriptionSuggestion && (
                    <div className="border-t pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">📝 Optimized Description</h4>
                            <button
                                onClick={() => copyToClipboard(descriptionSuggestion, "desc")}
                                className="text-[10px] text-primary hover:underline"
                            >
                                {copiedField === "desc" ? "✅ Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 text-sm leading-relaxed">
                            {descriptionSuggestion}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            {descriptionSuggestion.length}/750 characters — paste this into your GBP description
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
