"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
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

    const brandName =
        typeof product.brand === "object" && product.brand !== null
            ? product.brand.name
            : "";

    const primarySpec =
        product.specifications && product.specifications.length > 0
            ? `${product.specifications[0].label}: ${product.specifications[0].value}`
            : null;

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md select-none"
        >
            <div>
                {/* 1. Proportional Media Canvas (aspect-4/3 scales with card width) */}
                <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                    {brandName && (
                        <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                            <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs leading-none">
                                {brandName}
                            </span>
                        </div>
                    )}

                    <div className="relative h-full w-full">
                        <Image
                            src={imageUrl}
                            alt={product.thumbnailImage?.altText || product.name}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105 pointer-events-none"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        />
                    </div>
                </div>

                {/* 2. Content Info Dock */}
                <div className="p-2.5 sm:p-3 space-y-1">
                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="line-clamp-2 text-xs sm:text-sm font-bold text-text-main transition-colors group-hover:text-accent leading-snug block"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    <p className="truncate text-xs font-medium text-text-muted">
                        {primarySpec || "Bulk Commercial Pack"}
                    </p>
                </div>
            </div>

            {/* 3. Bottom Action Footer */}
            <div className="p-2.5 sm:p-3 pt-0">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted transition-colors hover:text-accent hover:underline">
                        Details
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        title="Add to Inquiry Cart"
                        aria-label="Add to Inquiry Cart"
                        className="flex cursor-pointer items-center gap-1 rounded-lg bg-badge-amber-bg border border-accent/40 px-2.5 py-1 text-xs font-bold text-badge-amber shadow-xs transition-all duration-150 active:scale-95 hover:bg-primary hover:border-primary hover:text-bg-main"
                    >
                        <Plus className="h-3 w-3" strokeWidth={2.5} />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);