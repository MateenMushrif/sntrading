"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

function ProductCardComponent({ product, onQuickView }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView(product);
    };

    const imageUrl =
        product.thumbnailImage?.secureUrl ||
        product.images?.[0]?.secureUrl ||
        "/placeholder-product.png";

    const categoryName =
        typeof product.category === "object" && product.category !== null
            ? product.category.name
            : typeof product.category === "string"
                ? product.category
                : "";

    return (
        <div
            onClick={handleCardClick}
            className="group w-full text-left cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col h-full overflow-hidden select-none"
        >
            <div className="relative w-full aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden shrink-0">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 pointer-events-none">
                    <span className="bg-slate-900 text-amber-400 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        SN Wholesale
                    </span>
                </div>

                <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={imageUrl}
                        alt={product.thumbnailImage?.altText || product.name}
                        fill
                        className="object-cover w-full h-full pointer-events-none"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    title="Add to Quote Request"
                    aria-label="Add to Quote Request"
                    className="absolute bottom-2 right-2 z-20 bg-slate-900 text-amber-400 hover:bg-amber-400 hover:text-slate-900 p-2 rounded-full shadow-md transition-colors duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
                >
                    <MessageSquarePlus className="w-4 h-4" />
                </button>
            </div>

            <div className="p-3 flex flex-col flex-grow justify-between w-full">
                <div>
                    {categoryName && (
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 block">
                            {categoryName}
                        </span>
                    )}

                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug mb-1 block"
                    >
                        {product.name}
                    </Link>

                    {product.shortDescription && (
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                            {product.shortDescription}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);