"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string | undefined>;
}

export default function Pagination({
    currentPage,
    totalPages,
    searchParams,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && key !== "page") {
                params.set(key, value);
            }
        });
        if (page > 1) {
            params.set("page", page.toString());
        }
        const queryString = params.toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
    };

    // Generate visible page numbers
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <nav
            aria-label="Pagination Navigation"
            className="flex items-center justify-center gap-1.5 pt-8 pb-4 select-none"
        >
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-amber-400 transition-colors shadow-2xs"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Link>
            ) : (
                <span className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                </span>
            )}

            {/* Number Buttons */}
            {pages.map((p, idx) => {
                if (p === "...") {
                    return (
                        <span
                            key={`ellipsis-${idx}`}
                            className="flex items-center justify-center h-9 w-9 text-xs text-slate-400 font-bold"
                        >
                            ...
                        </span>
                    );
                }

                const pageNum = Number(p);
                const isActive = pageNum === currentPage;

                return isActive ? (
                    <span
                        key={pageNum}
                        aria-current="page"
                        className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 text-amber-400 text-xs font-black shadow-xs"
                    >
                        {pageNum}
                    </span>
                ) : (
                    <Link
                        key={pageNum}
                        href={createPageUrl(pageNum)}
                        className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:text-slate-900 text-xs font-bold transition-colors shadow-2xs"
                    >
                        {pageNum}
                    </Link>
                );
            })}

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-amber-400 transition-colors shadow-2xs"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <span className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                </span>
            )}
        </nav>
    );
}