"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
}

function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 animate-pulse flex flex-col justify-between">
            {/* Aspect Square Image Skeleton */}
            <div className="w-full aspect-square bg-slate-200 rounded-xl" />

            {/* Content Placeholder Lines */}
            <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-200 rounded-md" />
                <div className="h-4 w-5/6 bg-slate-200 rounded-md" />
                <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
            </div>

            {/* Packaging Badge / Footer Skeleton */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="h-5 w-20 bg-slate-200 rounded-md" />
                <div className="h-8 w-8 bg-slate-200 rounded-lg shrink-0" />
            </div>
        </div>
    );
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenQuickView = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseQuickView = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="w-full relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {loading ? (
                    // Render 8 card skeletons while loading
                    [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
                ) : products && products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id || product.slug}
                            product={product}
                            onQuickView={handleOpenQuickView}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
                        <p className="text-sm font-bold text-slate-700">No products found</p>
                        <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
                    </div>
                )}
            </div>

            {/* QuickView Modal */}
            <QuickViewModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseQuickView}
            />
        </div>
    );
}