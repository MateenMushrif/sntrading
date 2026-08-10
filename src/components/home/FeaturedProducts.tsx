"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
    products?: Product[];
}

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // ✅ Memoize QuickView handler to preserve ProductCard React.memo optimization
    const handleOpenQuickView = useCallback((p: Product) => {
        setSelectedProduct(p);
    }, []);

    const handleCloseQuickView = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    if (!products.length) return null;

    return (
        <section className="py-6 sm:py-8">
            <div className="container mx-auto px-3 sm:px-4">
                {/* Standardized Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-extrabold text-primary md:text-2xl">
                        Featured Bakery Products
                    </h2>
                    <p className="mt-1 text-xs text-text-muted md:text-sm">
                        Top-selling raw materials preferred by commercial bakeries
                    </p>
                </div>

                {/* Grid matching category card gap rhythm */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={handleOpenQuickView}
                        />
                    ))}
                </div>
            </div>

            <QuickViewModal
                product={selectedProduct}
                isOpen={Boolean(selectedProduct)}
                onClose={handleCloseQuickView}
            />
        </section>
    );
}