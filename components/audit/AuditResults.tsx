"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./ScoreGauge";
import type { AuditResult } from "@/types";

interface AuditResultsProps {
    result: AuditResult;
}

export function AuditResults({ result }: AuditResultsProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return <Badge variant="destructive">High</Badge>;
            case "medium":
                return <Badge variant="warning">Medium</Badge>;
            default:
                return <Badge variant="secondary">Low</Badge>;
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Overall Score */}
            <Card>
                <CardContent className="p-8 text-center">
                    <ScoreGauge score={result.score} />
                    <h2 className={`text-4xl font-bold mt-4 ${getScoreColor(result.score)}`}>
                        {result.score}/100
                    </h2>
                    <p className="text-muted-foreground mt-1">Overall GBP Health Score</p>
                </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{result.profileComplete}</p>
                        <p className="text-xs text-muted-foreground mt-1">Profile (out of 35)</p>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full gradient-primary rounded-full transition-all duration-1000"
                                style={{ width: `${(result.profileComplete / 35) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{result.contentActivity}</p>
                        <p className="text-xs text-muted-foreground mt-1">Content (out of 35)</p>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                                style={{ width: `${(result.contentActivity / 35) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{result.engagement}</p>
                        <p className="text-xs text-muted-foreground mt-1">Engagement (out of 30)</p>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                                style={{ width: `${(result.engagement / 30) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Issues Found ({result.issues.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {result.issues.map((issue, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                            >
                                <div className="mt-0.5">{getSeverityBadge(issue.severity)}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{issue.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        💡 {issue.recommendation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
