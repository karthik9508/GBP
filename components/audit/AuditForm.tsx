"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { AuditResult } from "@/types";

export function AuditForm({
    onResult,
}: {
    onResult: (result: AuditResult) => void;
}) {
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessName, email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Audit failed");

            onResult(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Audit failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Free GBP Audit
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Get your profile health score in 30 seconds. No login required.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name *</label>
                        <Input
                            placeholder="e.g. Sharma's Kitchen Delhi"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Email <span className="text-muted-foreground">(optional — for PDF report)</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="you@business.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-2">
                            {error}
                        </p>
                    )}

                    <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                        {loading ? <LoadingSpinner size="sm" /> : "Run Free Audit →"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
