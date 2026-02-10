import { NextResponse } from "next/server";
import { generateMockAuditResult } from "@/lib/audit/scoring";

export async function POST(request: Request) {
    try {
        const { businessName, email } = await request.json();

        if (!businessName || businessName.trim().length < 2) {
            return NextResponse.json(
                { error: "Please enter a valid business name" },
                { status: 400 }
            );
        }

        // TODO: When GBP API is configured, use real data
        // For now, generate a realistic mock audit
        const result = generateMockAuditResult(businessName.trim());

        // TODO: Save audit to database if user is logged in
        // TODO: Send email report if email provided

        if (email) {
            console.log(`Audit report will be sent to: ${email}`);
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: "Failed to run audit. Please try again." },
            { status: 500 }
        );
    }
}
