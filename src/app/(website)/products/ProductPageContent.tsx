"use client";

import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import EmptyState from "@/components/shared/EmptyState";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";

export default function ProductPageContent() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";

    const { products = [], loading, error } = useProducts({
        search,
        category,
        brand,
    });

    const getPageTitle = (): string => {
        if (search) return `Search Results for "${search}"`;
        if (category) return `${category.replace(/-/g, " ")} Products`;
        if (brand) return `${brand.replace(/-/g, " ")} Range`;
        return "All Products";
    };

    if (error) {
        return (
            <EmptyState
                title="Error loading products"
                message={error || "Failed to fetch products. Please try again."}
            />
        );
    }

    if (loading) {
        return <ProductGridSkeleton />;
    }

    const productCount = products.length;

    return (
        <section aria-labelledby="products-heading">
            <div className="mb-6">
                <h1
                    id="products-heading"
                    className="text-2xl font-extrabold text-slate-900 capitalize"
                >
                    {getPageTitle()}
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                    {productCount > 0
                        ? `Showing ${productCount} commercial bakery raw material${productCount === 1 ? "" : "s"
                        }.`
                        : "Browse our complete commercial bakery raw materials catalogue."}
                </p>
            </div>

            {productCount === 0 ? (
                <EmptyState
                    title="No products found"
                    message="Try adjusting your search query or active category filters."
                />
            ) : (
                <ProductGrid products={products} />
            )}
        </section>
    );
}