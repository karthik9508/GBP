"use client";

import { useState } from "react";
import { AuditForm } from "@/components/audit/AuditForm";
import { AuditResults } from "@/components/audit/AuditResults";
import type { AuditResult } from "@/types";

export default function AuditPage() {
    const [result, setResult] = useState<AuditResult | null>(null);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">GBP Audit</h1>
                <p className="text-muted-foreground mt-1">
                    Analyze your Google Business Profile and get actionable recommendations.
                </p>
            </div>

            {!result ? (
                <AuditForm onResult={setResult} />
            ) : (
                <div className="space-y-4">
                    <button
                        onClick={() => setResult(null)}
                        className="text-sm text-primary hover:underline"
                    >
                        ← Run another audit
                    </button>
                    <AuditResults result={result} />
                </div>
            )}
        </div>
    );
}
