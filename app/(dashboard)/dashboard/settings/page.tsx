"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account, subscription, and connected services.
                </p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                            U
                        </div>
                        <div>
                            <p className="font-semibold">User Name</p>
                            <p className="text-sm text-muted-foreground">user@example.com</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input defaultValue="User Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input defaultValue="user@example.com" disabled />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Subscription
                        <Badge variant="secondary">Free Plan</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Free Plan</p>
                                <p className="text-sm text-muted-foreground">
                                    1 audit • Basic recommendations
                                </p>
                            </div>
                            <p className="text-2xl font-bold">₹0</p>
                        </div>
                        <Button variant="gradient">Upgrade to Pro →</Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xl font-bold">0/1</p>
                            <p className="text-xs text-muted-foreground">Audits Used</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xl font-bold">0/0</p>
                            <p className="text-xs text-muted-foreground">Posts Scheduled</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xl font-bold">0/0</p>
                            <p className="text-xs text-muted-foreground">AI Responses</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔗</span>
                            <div>
                                <p className="font-medium text-sm">Google Business Profile</p>
                                <p className="text-xs text-muted-foreground">
                                    Not connected
                                </p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline">
                            Connect
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Delete Account</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
