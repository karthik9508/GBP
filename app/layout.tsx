import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "GBP Pro - Google Business Profile Management Suite",
    description:
        "Automate your Google Business Profile. Schedule posts, respond to reviews with AI, and optimize your local SEO — all in one place. Built for Indian businesses.",
    keywords: [
        "Google Business Profile",
        "GBP management",
        "local SEO",
        "post scheduler",
        "AI review response",
        "Google My Business",
    ],
    openGraph: {
        title: "GBP Pro - Google Business Profile Management Suite",
        description:
            "Schedule posts, respond to reviews with AI, and optimize your local SEO.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen antialiased">{children}</body>
        </html>
    );
}
