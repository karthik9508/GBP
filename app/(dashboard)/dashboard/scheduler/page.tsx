"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ScheduledPost {
    id: string;
    type: string;
    content: string;
    image_url: string | null;
    business_name: string | null;
    scheduled_at: string;
    status: string;
    created_at: string;
}

const postTypeConfig: Record<string, { color: string; icon: string }> = {
    UPDATE: { color: "bg-blue-500/10 text-blue-500", icon: "📢" },
    OFFER: { color: "bg-amber-500/10 text-amber-500", icon: "🔥" },
    EVENT: { color: "bg-purple-500/10 text-purple-500", icon: "📅" },
    PRODUCT: { color: "bg-emerald-500/10 text-emerald-500", icon: "🛍️" },
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        + " at "
        + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function SchedulerPage() {
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Form state
    const [postType, setPostType] = useState("UPDATE");
    const [content, setContent] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [businessName, setBusinessName] = useState("");

    // Image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI generation
    const [aiTopic, setAiTopic] = useState("");
    const [generating, setGenerating] = useState(false);
    const [aiSource, setAiSource] = useState<"ai" | "template" | null>(null);

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/scheduled-posts");
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPosts(data.posts || []);
        } catch {
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB");
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // AI generate content
    const handleGenerate = async () => {
        if (!aiTopic.trim()) {
            alert("Please enter a topic for the AI to write about");
            return;
        }

        setGenerating(true);
        setAiSource(null);
        try {
            const res = await fetch("/api/ai/generate-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: businessName || "Our Business",
                    postType,
                    topic: aiTopic.trim(),
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setContent(data.content);
            setAiSource(data.source);
        } catch {
            alert("Failed to generate content. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    // Submit post
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || !scheduledAt) {
            alert("Please fill in content and schedule time");
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl: string | null = null;

            // Upload image first if selected
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                setUploading(false);

                if (uploadData.error) {
                    alert(`Image upload failed: ${uploadData.error}`);
                    setSubmitting(false);
                    return;
                }
                imageUrl = uploadData.url;
            }

            // Create post
            const res = await fetch("/api/scheduled-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: postType,
                    content: content.trim(),
                    image_url: imageUrl,
                    scheduled_at: new Date(scheduledAt).toISOString(),
                    business_name: businessName.trim() || null,
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Reset form and refresh
            resetForm();
            setShowForm(false);
            fetchPosts();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to schedule post");
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    // Delete post
    const handleDelete = async (postId: string) => {
        if (!confirm("Delete this scheduled post?")) return;
        setDeleting(postId);
        try {
            const res = await fetch(`/api/scheduled-posts?id=${postId}`, { method: "DELETE" });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPosts(posts.filter((p) => p.id !== postId));
        } catch {
            alert("Failed to delete post");
        } finally {
            setDeleting(null);
        }
    };

    const resetForm = () => {
        setPostType("UPDATE");
        setContent("");
        setScheduledAt("");
        setBusinessName("");
        setImageFile(null);
        setImagePreview(null);
        setAiTopic("");
        setAiSource(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-foreground">Loading posts...</p>
                </div>
            </div>
        );
    }

    const scheduledPosts = posts.filter((p) => p.status === "scheduled");
    const pastPosts = posts.filter((p) => p.status !== "scheduled");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Post Scheduler</h1>
                    <p className="text-muted-foreground mt-1">
                        Schedule and manage your Google Business Profile posts.
                    </p>
                </div>
                <Button
                    variant="gradient"
                    onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
                >
                    {showForm ? "✕ Cancel" : "➕ New Post"}
                </Button>
            </div>

            {error && (
                <div className="text-center py-4">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => { setError(""); fetchPosts(); }} className="mt-2">
                        Retry
                    </Button>
                </div>
            )}

            {/* New Post Form */}
            {showForm && (
                <Card className="animate-fade-in border-primary/20">
                    <CardHeader>
                        <CardTitle>Schedule New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Business Name (optional) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Name <span className="text-muted-foreground">(optional)</span></label>
                                <Input
                                    placeholder="e.g. Sharma's Kitchen"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>

                            {/* Post Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Post Type</label>
                                <div className="flex gap-2 flex-wrap">
                                    {(["UPDATE", "OFFER", "EVENT", "PRODUCT"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setPostType(type)}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${postType === type
                                                    ? "gradient-primary text-white shadow-md"
                                                    : "bg-muted hover:bg-muted/80"
                                                }`}
                                        >
                                            <span>{postTypeConfig[type].icon}</span>
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Content Generator */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">✨ AI Content Generator</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter a topic (e.g. 'weekend sale on electronics')"
                                        value={aiTopic}
                                        onChange={(e) => setAiTopic(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerate}
                                        disabled={generating || !aiTopic.trim()}
                                        className="whitespace-nowrap"
                                    >
                                        {generating ? (
                                            <span className="flex items-center gap-2">
                                                <LoadingSpinner size="sm" /> Generating...
                                            </span>
                                        ) : (
                                            "✨ Generate"
                                        )}
                                    </Button>
                                </div>
                                {aiSource && (
                                    <p className="text-xs text-muted-foreground">
                                        Generated via {aiSource === "ai" ? "🤖 AI (GPT-4o-mini)" : "📄 template"} — feel free to edit!
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Post Content</label>
                                <Textarea
                                    placeholder="Write your post content or use AI to generate..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={5}
                                    maxLength={1500}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {content.length}/1500 characters
                                </p>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">📷 Post Image <span className="text-muted-foreground">(optional)</span></label>
                                {!imagePreview ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                                    >
                                        <div className="space-y-2">
                                            <span className="text-4xl">🖼️</span>
                                            <p className="text-sm text-muted-foreground">
                                                Click to upload or drag an image here
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                JPEG, PNG, WebP, GIF — Max 5MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 rounded-lg border object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Schedule Date & Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">📅 Schedule Date & Time</label>
                                <Input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    required
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" variant="gradient" disabled={submitting}>
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            {uploading ? "Uploading image..." : "Scheduling..."}
                                        </span>
                                    ) : (
                                        "📅 Schedule Post"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowForm(false); resetForm(); }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Scheduled Posts */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    📋 Scheduled Posts
                    {scheduledPosts.length > 0 && (
                        <Badge variant="secondary">{scheduledPosts.length}</Badge>
                    )}
                </h2>

                {scheduledPosts.length === 0 && !loading ? (
                    <Card>
                        <CardContent className="py-12 text-center space-y-3">
                            <span className="text-5xl">📅</span>
                            <p className="font-medium">No scheduled posts yet</p>
                            <p className="text-sm text-muted-foreground">
                                Create your first post to get started!
                            </p>
                            {!showForm && (
                                <Button variant="gradient" onClick={() => setShowForm(true)}>
                                    ➕ Create Your First Post
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    scheduledPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            deleting={deleting === post.id}
                        />
                    ))
                )}
            </div>

            {/* Past Posts */}
            {pastPosts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        📜 Past Posts
                        <Badge variant="secondary">{pastPosts.length}</Badge>
                    </h2>
                    {pastPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            deleting={deleting === post.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Post Card component
function PostCard({
    post,
    onDelete,
    deleting,
}: {
    post: ScheduledPost;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    const config = postTypeConfig[post.type] || postTypeConfig.UPDATE;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        {/* Type + Status badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 ${config.color}`}>
                                {config.icon} {post.type}
                            </span>
                            <Badge
                                variant={
                                    post.status === "published" ? "success"
                                        : post.status === "failed" ? "destructive"
                                            : "secondary"
                                }
                            >
                                {post.status}
                            </Badge>
                            {post.business_name && (
                                <span className="text-xs text-muted-foreground">
                                    • {post.business_name}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <p className="text-sm leading-relaxed">{post.content}</p>

                        {/* Image thumbnail */}
                        {post.image_url && (
                            <img
                                src={post.image_url}
                                alt="Post image"
                                className="max-h-32 rounded-lg border object-cover"
                            />
                        )}

                        {/* Date */}
                        <p className="text-xs text-muted-foreground">
                            📅 {formatDate(post.scheduled_at)}
                        </p>
                    </div>

                    {/* Actions */}
                    {post.status === "scheduled" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(post.id)}
                            disabled={deleting}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                            {deleting ? <LoadingSpinner size="sm" /> : "🗑️"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
