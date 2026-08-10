"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Hide breadcrumbs on homepage
    if (pathname === "/") return null;

    // Segment pathname into clean readable labels
    const segments = pathname.split("/").filter(Boolean);

    // Helper: Detect CUID/UUID strings to display "Details" fallback
    const isIdString = (str: string) => /^[a-z0-9]{20,}$/i.test(str) || /^[0-9a-f-]{36}$/i.test(str);

    return (
        <div className="w-full bg-slate-100/70 border-b border-slate-200/80 backdrop-blur-xs">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-slate-500">
                        {/* Home Link */}
                        <li>
                            <Link
                                href="/"
                                className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                            >
                                <Home className="w-3.5 h-3.5" />
                                <span className="sr-only">Home</span>
                            </Link>
                        </li>

                        {/* Path Segments */}
                        {segments.map((segment, index) => {
                            const href = "/" + segments.slice(0, index + 1).join("/");
                            const isLast = index === segments.length - 1;

                            // Format slug or apply "Details" fallback for CUIDs
                            const rawText = decodeURIComponent(segment);
                            const formattedLabel = isIdString(rawText)
                                ? "Details"
                                : rawText
                                    .replace(/-/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase());

                            return (
                                <li key={href} className="flex items-center gap-1.5">
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {isLast ? (
                                        <span className="font-bold text-slate-900 truncate max-w-xs">
                                            {formattedLabel}
                                        </span>
                                    ) : (
                                        <Link
                                            href={href}
                                            className="hover:text-amber-600 transition-colors whitespace-nowrap"
                                        >
                                            {formattedLabel}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </div>
    );
}