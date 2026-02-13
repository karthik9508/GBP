"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { AuditResult } from "@/types";

interface PlaceResult {
    place_id: string;
    name: string;
    address: string;
    rating: number | null;
    review_count: number;
    phone: string | null;
    website: string | null;
    has_hours: boolean;
    photo_count: number;
    description: string | null;
    types: string[];
}

export function AuditForm({
    onResult,
}: {
    onResult: (result: AuditResult) => void;
}) {
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    // Search results & selection
    const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [fallbackMode, setFallbackMode] = useState(false);

    const handleSearch = useCallback(async () => {
        if (businessName.trim().length < 2) return;
        setSearching(true);
        setError("");
        setSelectedPlace(null);
        setShowResults(false);

        try {
            const res = await fetch(
                `/api/audit/search?q=${encodeURIComponent(businessName.trim())}`
            );
            const data = await res.json();

            if (data.fallback) {
                setFallbackMode(true);
                setShowResults(false);
            } else if (data.results.length === 0) {
                setError("No businesses found. Try a different name or add a location.");
                setShowResults(false);
            } else {
                setSearchResults(data.results);
                setShowResults(true);
                setFallbackMode(false);
            }
        } catch {
            setError("Search failed. You can still run the audit manually.");
            setFallbackMode(true);
        } finally {
            setSearching(false);
        }
    }, [businessName]);

    const handleSelectPlace = (place: PlaceResult) => {
        setSelectedPlace(place);
        setBusinessName(place.name);
        setShowResults(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: selectedPlace?.name || businessName,
                    email,
                    placeId: selectedPlace?.place_id || null,
                    address: selectedPlace?.address || null,
                    placeDetails: selectedPlace ? {
                        name: selectedPlace.name,
                        address: selectedPlace.address,
                        phone: selectedPlace.phone,
                        website: selectedPlace.website,
                        has_hours: selectedPlace.has_hours,
                        photo_count: selectedPlace.photo_count,
                        description: selectedPlace.description,
                        rating: selectedPlace.rating,
                        review_count: selectedPlace.review_count,
                        types: selectedPlace.types,
                    } : null,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Audit failed");

            onResult(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Audit failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Free GBP Audit
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Get your profile health score in 30 seconds. No login required.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Business Name + Search */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name *</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. Sharma's Kitchen Delhi"
                                value={businessName}
                                onChange={(e) => {
                                    setBusinessName(e.target.value);
                                    setSelectedPlace(null);
                                    setShowResults(false);
                                }}
                                required
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSearch}
                                disabled={searching || businessName.trim().length < 2}
                                className="shrink-0"
                            >
                                {searching ? <LoadingSpinner size="sm" /> : "🔎 Search"}
                            </Button>
                        </div>
                    </div>

                    {/* Search Results List */}
                    {showResults && searchResults.length > 0 && (
                        <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                            <p className="text-xs text-muted-foreground px-3 py-2 bg-muted/50">
                                Select your business to confirm:
                            </p>
                            {searchResults.map((place) => (
                                <button
                                    key={place.place_id}
                                    type="button"
                                    onClick={() => handleSelectPlace(place)}
                                    className="w-full text-left px-3 py-3 hover:bg-accent/50 transition-colors focus:bg-accent/50 focus:outline-none"
                                >
                                    <div className="font-medium text-sm">{place.name}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                        📍 {place.address}
                                    </div>
                                    {place.rating && (
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            ⭐ {place.rating} ({place.review_count} reviews)
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Selected Business Confirmation */}
                    {selectedPlace && (
                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                        ✅ {selectedPlace.name}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                        📍 {selectedPlace.address}
                                    </p>
                                    {selectedPlace.rating && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                            ⭐ {selectedPlace.rating} ({selectedPlace.review_count} reviews)
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedPlace(null);
                                        setShowResults(true);
                                    }}
                                    className="text-xs text-green-600 hover:text-green-800 underline shrink-0"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Email <span className="text-muted-foreground">(optional — for PDF report)</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="you@business.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-2">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        variant="gradient"
                        className="w-full"
                        disabled={loading || (!selectedPlace && !fallbackMode && businessName.trim().length < 2)}
                    >
                        {loading ? <LoadingSpinner size="sm" /> : "Run Free Audit →"}
                    </Button>

                    {!selectedPlace && !fallbackMode && businessName.trim().length >= 2 && !showResults && (
                        <p className="text-xs text-center text-muted-foreground">
                            Click &quot;🔎 Search&quot; to find your business and confirm the address
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
