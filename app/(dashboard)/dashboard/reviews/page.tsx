"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Review {
    id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    reviewDate: string;
    replyStatus: string;
    aiGeneratedReply?: string;
    postedReply?: string;
}

const mockReviews: Review[] = [
    {
        id: "1",
        reviewerName: "Aarav Kumar",
        rating: 5,
        comment: "Absolutely amazing experience! The staff was incredibly welcoming and the service was top-notch. Highly recommend to everyone!",
        reviewDate: "2026-02-08T14:30:00Z",
        replyStatus: "pending",
    },
    {
        id: "2",
        reviewerName: "Sneha Gupta",
        rating: 4,
        comment: "Great service overall. Would have been 5 stars but the wait time was a bit long. Food was delicious though!",
        reviewDate: "2026-02-07T11:00:00Z",
        replyStatus: "ai_generated",
        aiGeneratedReply: "Thank you so much for your kind words, Sneha! We appreciate your feedback about the wait time and are working on streamlining our service to reduce delays. We're glad you enjoyed the food and look forward to serving you again soon!",
    },
    {
        id: "3",
        reviewerName: "Rajesh Patel",
        rating: 2,
        comment: "Disappointing experience. The order was wrong and it took too long to fix. Expected better from a well-rated place.",
        reviewDate: "2026-02-05T18:00:00Z",
        replyStatus: "posted",
        postedReply: "Dear Rajesh, we sincerely apologize for the inconvenience. This is not the standard of service we aim to provide. We've addressed this with our team. Please reach out to us directly so we can make it right. Thank you for your feedback.",
    },
    {
        id: "4",
        reviewerName: "Meera Nair",
        rating: 5,
        comment: "Perfect! Love this place. Been coming here for years and they never disappoint. Best in the city!",
        reviewDate: "2026-02-03T09:00:00Z",
        replyStatus: "pending",
    },
];

export default function ReviewsPage() {
    const [reviews] = useState<Review[]>(mockReviews);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleGenerateResponse = async (reviewId: string) => {
        setGeneratingId(reviewId);
        // Simulate AI generation
        setTimeout(() => {
            setGeneratingId(null);
            alert("AI response generated! (OpenAI integration coming soon)");
        }, 2000);
    };

    const getStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "text-amber-400" : "text-muted"}>
                ★
            </span>
        ));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "posted":
                return <Badge variant="success">✓ Replied</Badge>;
            case "ai_generated":
                return <Badge variant="warning">AI Draft Ready</Badge>;
            default:
                return <Badge variant="secondary">Needs Response</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and respond to your Google Business Profile reviews.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{reviews.length}</span> total reviews
                    <span className="mx-1">•</span>
                    <span className="font-semibold text-amber-500">
                        {reviews.filter((r) => r.replyStatus === "pending").length}
                    </span>{" "}
                    need response
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {["All", "Needs Response", "AI Draft", "Replied"].map((filter) => (
                    <button
                        key={filter}
                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                                            {review.reviewerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{review.reviewerName}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{getStars(review.rating)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(review.reviewDate).toLocaleDateString("en-IN", {
                                                        dateStyle: "medium",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(review.replyStatus)}
                                </div>

                                {/* Comment */}
                                <p className="text-sm leading-relaxed">{review.comment}</p>

                                {/* AI Generated Reply */}
                                {review.aiGeneratedReply && review.replyStatus === "ai_generated" && (
                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 space-y-2">
                                        <p className="text-xs font-medium text-blue-500">🤖 AI Generated Response</p>
                                        <p className="text-sm">{review.aiGeneratedReply}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="gradient">
                                                Post Reply
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                Regenerate
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Posted Reply */}
                                {review.postedReply && review.replyStatus === "posted" && (
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                                        <p className="text-xs font-medium text-emerald-500">✓ Your Reply</p>
                                        <p className="text-sm mt-1">{review.postedReply}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {review.replyStatus === "pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="gradient"
                                            onClick={() => handleGenerateResponse(review.id)}
                                            disabled={generatingId === review.id}
                                        >
                                            {generatingId === review.id ? (
                                                <>
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                "🤖 Generate AI Response"
                                            )}
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Write Manually
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
