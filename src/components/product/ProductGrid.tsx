"use client";

import { useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
    gridClassName?: string;
}

export default function ProductGrid({
    products,
    gridClassName = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",
}: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenQuickView = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    const handleCloseQuickView = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return (
        <div className="w-full relative">
            <div className={`grid ${gridClassName}`}>
                {products && products.length > 0 ? (
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

            <QuickViewModal
                product={selectedProduct}
                isOpen={Boolean(selectedProduct)}
                onClose={handleCloseQuickView}
            />
        </div>
    );
}