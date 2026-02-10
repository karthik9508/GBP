import { cn } from "@/lib/utils";

interface ErrorMessageProps {
    title?: string;
    message: string;
    className?: string;
    onRetry?: () => void;
}

export function ErrorMessage({
    title = "Something went wrong",
    message,
    className,
    onRetry,
}: ErrorMessageProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-destructive/20 bg-destructive/5 p-4",
                className
            )}
        >
            <div className="flex items-start gap-3">
                <span className="text-destructive text-lg">⚠️</span>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-destructive">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="text-sm text-primary hover:underline mt-2 font-medium"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
