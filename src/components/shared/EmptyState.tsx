import Link from "next/link";
import { PackageOpen, RefreshCw } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    onReset?: () => void;
}

export default function EmptyState({
    title = "No results found",
    message = "Try adjusting your search query or filters to find what you're looking for.",
    actionLabel,
    actionHref,
    onReset,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border-subtle rounded-xl bg-bg-off my-6">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-accent mb-3">
                <PackageOpen className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-primary">{title}</h3>
            <p className="text-2xs text-text-muted mt-1 max-w-sm leading-relaxed">
                {message}
            </p>

            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-bg-main text-2xs font-bold rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                    {actionLabel}
                </Link>
            )}

            {onReset && !actionHref && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-bg-main text-2xs font-bold rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                    <RefreshCw className="w-3 h-3 text-accent" />
                    <span>Reset Filters</span>
                </button>
            )}
        </div>
    );
}