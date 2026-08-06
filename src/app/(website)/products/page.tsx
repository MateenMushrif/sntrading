import { Suspense } from "react";
import type { Metadata } from "next";
import ProductPageContent from "./ProductPageContent";
import Loading from "@/components/shared/Loading";

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

export default function ProductsPage() {
    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6">
            <Suspense fallback={<Loading />}>
                <ProductPageContent />
            </Suspense>
        </main>
    );
}