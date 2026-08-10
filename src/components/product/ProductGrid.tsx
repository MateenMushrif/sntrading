"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
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
                isOpen={isModalOpen}
                onClose={handleCloseQuickView}
            />
        </div>
    );
}