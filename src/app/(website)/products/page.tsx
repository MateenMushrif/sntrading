import { Suspense } from "react";
import type { Metadata } from "next";
import ProductPageContent from "./ProductPageContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "All Products & Bakery Raw Materials",
    description:
        "Browse our complete B2B wholesale catalogue of cocoa powders, chocolate compounds, industrial fats, margarine, emulsifiers, and bakery pre-mixes.",
    openGraph: {
        title: "All Products | SN Trading Wholesale Catalogue",
        description:
            "Explore high-grade bakery raw materials available for bulk wholesale inquiry.",
    },
};

function ProductsPageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                <div className="h-4 w-80 bg-slate-200 rounded-md" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center shadow-xs">
                <div className="h-10 w-full md:w-80 bg-slate-200 rounded-xl" />
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="h-10 w-36 bg-slate-200 rounded-xl" />
                    <div className="h-10 w-36 bg-slate-200 rounded-xl" />
                </div>
            </div>

            {/* 8 Card Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-2xs flex flex-col justify-between"
                    >
                        <div className="w-full aspect-square bg-slate-200 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-3 w-16 bg-slate-200 rounded-md" />
                            <div className="h-4 w-5/6 bg-slate-200 rounded-md" />
                            <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="h-5 w-20 bg-slate-200 rounded-md" />
                            <div className="h-8 w-8 bg-slate-200 rounded-lg shrink-0" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6">
            <Suspense fallback={<ProductsPageSkeleton />}>
                <ProductPageContent />
            </Suspense>
        </main>
    );
}