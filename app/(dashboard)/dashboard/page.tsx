import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
    { label: "Scheduled Posts", value: "12", icon: "📅", trend: "+3 this week" },
    { label: "Reviews", value: "48", icon: "⭐", trend: "4.6 avg rating" },
    { label: "Audit Score", value: "82", icon: "🔍", trend: "+5 from last" },
    { label: "AI Credits", value: "25", icon: "🤖", trend: "15 remaining" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here&apos;s your Google Business Profile overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <span className="text-2xl">{stat.icon}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                📅
                            </div>
                            <div>
                                <h3 className="font-semibold">Schedule a Post</h3>
                                <p className="text-sm text-muted-foreground">
                                    Create and schedule your next GBP post
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                ⭐
                            </div>
                            <div>
                                <h3 className="font-semibold">Respond to Reviews</h3>
                                <p className="text-sm text-muted-foreground">
                                    <Badge variant="warning" className="mr-1">3 new</Badge>
                                    reviews need responses
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🔍
                            </div>
                            <div>
                                <h3 className="font-semibold">Run Audit</h3>
                                <p className="text-sm text-muted-foreground">
                                    Check your profile health score
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
