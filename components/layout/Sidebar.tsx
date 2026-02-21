"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/audit", label: "Audit", icon: "🔍" },
    { href: "/dashboard/reports", label: "Reports", icon: "📋" },
    { href: "/dashboard/reviews", label: "Reviews", icon: "⭐" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
            <div className="flex flex-col flex-grow bg-card border-r overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center h-16 px-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <span className="text-xl font-bold gradient-text">GBP Pro</span>
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Upgrade Card */}
                <div className="p-4">
                    <div className="rounded-lg gradient-primary p-4 text-white">
                        <h4 className="font-semibold text-sm">Upgrade to Pro</h4>
                        <p className="text-xs text-blue-100 mt-1">
                            Unlock AI responses & unlimited posts
                        </p>
                        <Link
                            href="/dashboard/settings"
                            className="inline-block mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
