"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquarePlus, ArrowUpRight } from "lucide-react";
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

    const brandName =
        typeof product.brand === "object" && product.brand !== null
            ? product.brand.name
            : "";

    return (
        <div
            onClick={handleCardClick}
            className="group w-full text-left cursor-pointer bg-bg-main rounded-2xl border border-border-subtle shadow-xs hover:shadow-xl hover:border-accent transition-all duration-300 flex flex-col h-full overflow-hidden select-none"
        >
            <div className="relative w-full aspect-square bg-bg-off flex items-center justify-center border-b border-border-subtle overflow-hidden shrink-0">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
                    {brandName ? (
                        <span className="bg-primary text-accent text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                            {brandName}
                        </span>
                    ) : (
                        <span className="bg-primary text-accent text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                            SN Wholesale
                        </span>
                    )}
                </div>

                <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={imageUrl}
                        alt={product.thumbnailImage?.altText || product.name}
                        fill
                        className="object-cover w-full h-full pointer-events-none"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
                    className="absolute bottom-3 right-3 z-20 bg-primary text-accent hover:bg-accent hover:text-primary p-2.5 rounded-xl shadow-md transition-colors duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
                >
                    <MessageSquarePlus className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between w-full space-y-3">
                <div className="space-y-1">
                    {categoryName && (
                        <span className="text-xs font-bold uppercase tracking-wider text-badge-amber block">
                            {categoryName}
                        </span>
                    )}

                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="font-bold text-text-main text-sm group-hover:text-accent transition-colors line-clamp-2 leading-snug block"
                    >
                        {product.name}
                    </Link>

                    {product.shortDescription && (
                        <p className="text-text-muted text-xs line-clamp-2 leading-relaxed pt-1">
                            {product.shortDescription}
                        </p>
                    )}
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted font-medium">
                    {product.specifications && product.specifications.length > 0 ? (
                        <span className="truncate">
                            <strong className="text-text-main">{product.specifications[0].label}:</strong> {product.specifications[0].value}
                        </span>
                    ) : (
                        <span>Commercial Grade</span>
                    )}

                    <span className="flex items-center gap-0.5 text-accent font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);