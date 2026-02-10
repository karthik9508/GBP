"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mobileNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/audit", label: "Audit", icon: "🔍" },
    { href: "/dashboard/scheduler", label: "Scheduler", icon: "📅" },
    { href: "/dashboard/reviews", label: "Reviews", icon: "⭐" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-accent"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Mobile Logo */}
                <div className="md:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl">🚀</span>
                        <span className="font-bold gradient-text">GBP Pro</span>
                    </Link>
                </div>

                {/* Spacer for desktop */}
                <div className="hidden md:block" />

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                        🔔
                    </Button>
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                        U
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <nav className="md:hidden border-t bg-card p-3 space-y-1">
                    {mobileNavItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent"
                                )}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}
