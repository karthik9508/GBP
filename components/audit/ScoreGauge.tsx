"use client";

interface ScoreGaugeProps {
    score: number;
    size?: number;
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    const getColor = (score: number) => {
        if (score >= 80) return "#10b981"; // emerald
        if (score >= 60) return "#f59e0b"; // amber
        return "#ef4444"; // red
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute text-center">
                <span className="text-3xl font-bold">{score}</span>
            </div>
        </div>
    );
}
