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
                    <p className="col-span-full text-center text-gray-500 py-8">
                        No products found.
                    </p>
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