"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Post {
    id: string;
    type: string;
    content: string;
    scheduledAt: string;
    status: string;
}

const mockPosts: Post[] = [
    {
        id: "1",
        type: "UPDATE",
        content: "🎉 We're excited to announce our new weekend special! Visit us this Saturday for exclusive deals.",
        scheduledAt: "2026-02-15T10:00:00Z",
        status: "scheduled",
    },
    {
        id: "2",
        type: "OFFER",
        content: "🔥 Flat 20% off on all services this Valentine's week! Use code LOVE20.",
        scheduledAt: "2026-02-14T09:00:00Z",
        status: "scheduled",
    },
    {
        id: "3",
        type: "UPDATE",
        content: "Thank you for making us the #1 rated business in our area! Your support means everything.",
        scheduledAt: "2026-02-10T12:00:00Z",
        status: "published",
    },
];

const postTypeColors: Record<string, string> = {
    UPDATE: "bg-blue-500/10 text-blue-500",
    OFFER: "bg-amber-500/10 text-amber-500",
    EVENT: "bg-purple-500/10 text-purple-500",
    PRODUCT: "bg-emerald-500/10 text-emerald-500",
};

export default function SchedulerPage() {
    const [posts] = useState<Post[]>(mockPosts);
    const [showForm, setShowForm] = useState(false);
    const [newPost, setNewPost] = useState({
        type: "UPDATE",
        content: "",
        scheduledAt: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API call to create post
        alert("Post scheduled! (API integration coming soon)");
        setShowForm(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Post Scheduler</h1>
                    <p className="text-muted-foreground mt-1">
                        Schedule and manage your Google Business Profile posts.
                    </p>
                </div>
                <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "➕ New Post"}
                </Button>
            </div>

            {/* New Post Form */}
            {showForm && (
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Schedule New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Post Type</label>
                                <div className="flex gap-2">
                                    {["UPDATE", "OFFER", "EVENT", "PRODUCT"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewPost({ ...newPost, type })}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${newPost.type === type
                                                    ? "gradient-primary text-white"
                                                    : "bg-muted hover:bg-muted/80"
                                                }`}
                                        >
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <Textarea
                                    placeholder="Write your post content..."
                                    value={newPost.content}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, content: e.target.value })
                                    }
                                    required
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {newPost.content.length}/1500 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Schedule Date & Time</label>
                                <Input
                                    type="datetime-local"
                                    value={newPost.scheduledAt}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, scheduledAt: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" variant="gradient">
                                    Schedule Post
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                    Scheduled & Recent Posts ({posts.length})
                </h2>
                {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${postTypeColors[post.type] || "bg-muted"
                                                }`}
                                        >
                                            {post.type}
                                        </span>
                                        <Badge
                                            variant={
                                                post.status === "published" ? "success" : "secondary"
                                            }
                                        >
                                            {post.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm">{post.content}</p>
                                    <p className="text-xs text-muted-foreground">
                                        📅{" "}
                                        {new Date(post.scheduledAt).toLocaleDateString("en-IN", {
                                            dateStyle: "medium",
                                        })}{" "}
                                        at{" "}
                                        {new Date(post.scheduledAt).toLocaleTimeString("en-IN", {
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                                {post.status === "scheduled" && (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                            ✏️
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            🗑️
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
